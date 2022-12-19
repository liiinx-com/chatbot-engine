import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import intentHandlers from './intent-handlers/index';
import { ERRORS, IncomingMessage } from './intent.types';
import { steps, intents } from './db/index';
import { ChatBotResponse } from 'src/chatbot/chatbot.types';

@Injectable()
export class IntentManager {
  private logger = new Logger(IntentManager.name);
  private STEP_ID_DELIMITER = '.';
  private NEW_LINE = '\n';
  private intentsMap = new Map();

  constructor(
    private readonly userService: UserService,
    @InjectQueue('intent*11557') private intentQueue: Queue,
  ) {}

  private async getUserActiveStepInfo(userId: number) {
    // TODO: get from db and if not existed in db then return fallback";
    const user = await this.userService.getUserById(userId);
    return user?.activeStepId
      ? { activeStepId: user.activeStepId, isNewUser: false }
      : {
          activeStepId: await this.getFallbackStepIdForUser(userId),
          isNewUser: true,
        };
  }

  private async getUserCurrentOutput(userId: number) {
    // TODO: get from db and if not existed in db then return fallback";
    const user = await this.userService.getUserById(userId);
    return user.output;
  }

  async resetUserOutput(userId: number) {
    const user = await this.userService.getUserById(userId);
    user.output = {};
  }

  async loadIntents({ intentsObject }) {
    Object.keys(intentsObject)
      .map((key) => ({
        key,
        value: intentsObject[key],
      }))
      .forEach(({ key, value }) => this.intentsMap.set(key, value));
    this.logger.log(`[i] ${this.intentsMap.size} intents loaded successfully `);
  }

  async updateUserActiveStepId(
    userId: number,
    { stepId = undefined, changes = undefined },
  ) {
    const user = await this.userService.getUserById(userId);
    if (stepId) user.activeStepId = stepId;
    if (changes) user.output = { ...user.output, ...changes };
    return user;
  }

  private async getFallbackStepIdForUser(userId: number) {
    //TODO: get bot default intent and then starterStepId for the intent
    return 'hi-step1';
    // return "newReturnOrder.1";
  }

  async getHandlerAndIntentAndStepByStepId(stepId: string): Promise<any> {
    if (!stepId) throw new Error(ERRORS.STEP_NOT_FOUND);

    const currentStep = steps.find((step) => step.id === stepId);

    const currentIntent = intents.find(
      (intent) => intent.id === currentStep.intentId,
    );

    if (currentStep && currentIntent) {
      const handler = intentHandlers[currentIntent.handlerModule];
      return [handler, currentIntent, currentStep];
    }
    throw new Error(ERRORS.STEP_NOT_FOUND);
  }

  async processTextMessageForUser(
    chatbotId: string,
    userId: number,
    message: IncomingMessage,
  ): Promise<ChatBotResponse[]> {
    const result: ChatBotResponse[] = [];
    let inputConsumed = false;
    const { text: userInput } = message;

    do {
      // 1. get user active stepId
      const userActiveStepInfo = await this.getUserActiveStepInfo(userId);
      const { activeStepId: userActiveStepId, isNewUser } = userActiveStepInfo;
      if (isNewUser) inputConsumed = true;
      this.logger.log(`[i] activeStepId = ${userActiveStepId}`);

      // 2. Get Handler Module, Intent and Step
      const [handlerModule, userCurrentIntent, userCurrentStep] =
        await this.getHandlerAndIntentAndStepByStepId(userActiveStepId); //TODO: implement------------------------

      const {
        getStepTextAndOptionsByStep,
        validate: validateFn,
        getNextStepFor,
        handleIntentComplete,
      } = handlerModule;

      // 3. Get Step Text and Options for the Current Step
      const [
        currentStepText,
        currentStepOptions,
        stepKey,
        stepRequiresUserInput,
      ] = await getStepTextAndOptionsByStep(
        userCurrentStep,
        userCurrentIntent,
        {
          message,
          isNewUser: userActiveStepInfo.isNewUser,
        },
      );

      // ! TODO: Do NOT create this here. move it to its parent
      const currentStepResponse = new ChatBotResponse();
      currentStepResponse.type = 'text';
      currentStepResponse.text =
        currentStepText +
        (stepRequiresUserInput
          ? '\n\n' + this.getOptionsTextFromOptions(currentStepOptions)
          : '');

      let userSelectedOption;
      if (stepRequiresUserInput) {
        if (inputConsumed) {
          result.push(currentStepResponse);
          return result;
        } else {
          // TODO: use built-in options validation if stepResponseType === multiple
          const {
            response: validatedResponse,
            selectedOption,
            ok: validationOk,
          } = await this.validateInputForStep(
            currentStepOptions,
            stepKey,
            userCurrentStep,
            userInput,
            validateFn,
          );

          userSelectedOption = selectedOption;
          if (!validationOk) return [...result, currentStepResponse];

          // 3. Update user output for the current active step
          await this.updateUserActiveStepId(userId, {
            changes: validatedResponse,
          });

          console.log(
            '-->step ' + userCurrentStep.id + 'complete with ',
            validatedResponse,
            selectedOption?.responses?.length,
          );

          // 4. UserCurrentStep is complete, Add selected option responses
          if (selectedOption?.responses) {
            selectedOption.responses.forEach((r: ChatBotResponse) =>
              result.push(r),
            );
          }
        }
      } else {
        result.push(currentStepResponse);
      }

      // 5. Check if intent is complete
      const { isIntentComplete, nextStepId } = await getNextStepFor(
        userCurrentStep,
        { message },
      );

      // 6. Handle Intent Complete and set nextStep if completed
      let gotoNextStepId: string;
      if (isIntentComplete) {
        const userCurrentOutput = await this.getUserCurrentOutput(userId);
        const { gotoStepId: intentGotoStepId, responses: intentResponses } =
          await handleIntentComplete(
            userCurrentIntent,
            userId,
            userCurrentOutput,
          );

        // 7. Add to queue
        const job = await this.intentQueue.add('complete', {
          shillang: { output: userCurrentOutput, message },
        });
        this.logger.log(`[i] job id ${job.id} registered on queue`);

        // 8. Add intent responses
        intentResponses.forEach((r: ChatBotResponse) => result.push(r));

        // 9. Determine NextStep
        gotoNextStepId = intentGotoStepId //! Decide what to do next
          ? intentGotoStepId
          : await this.getFallbackStepIdForUser(userId);
        await this.resetUserOutput(userId);
      } else {
        // selectedOption.nextStepId or step.nextStepId
        gotoNextStepId = nextStepId;
      }

      // 10. override selectedOption next step if applicable
      if (userSelectedOption && userSelectedOption.gotoStepId) {
        this.logger.log(
          '[i] overidding ' +
            gotoNextStepId +
            ' to ' +
            userSelectedOption.gotoStepId,
        );
        gotoNextStepId = userSelectedOption.gotoStepId;
      }

      await this.updateUserActiveStepId(userId, {
        stepId: gotoNextStepId,
      });
      inputConsumed = true;
    } while (true);
  }

  private getOptionsTextFromOptions(options: any) {
    return options
      .map(({ numericValue, label }) => `${numericValue}. *${label}*`)
      .join(this.NEW_LINE);
  }

  async validateInputForStep(
    stepOptions: any,
    stepKey: string,
    step: any,
    value: string,
    validateFn: any,
  ) {
    const result = {
      ok: true,
      response: {},
      errorCode: undefined,
    };
    if (stepOptions.length === 0) {
      const stepValidationResult = await validateFn(step, value, {
        stepKey,
        stepOptions,
      });
      if (stepValidationResult.ok)
        return {
          ...result,
          selectedOption: null,
          response: {
            [stepKey]: value,
          },
        };
    }

    const validValues = stepOptions.map(({ numericValue }) =>
      numericValue.toString(),
    );

    if (!validValues.includes(value.toString()))
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        response: null,
        selectedOption: null,
      };

    const selectedOption = stepOptions.find(
      ({ numericValue }) => numericValue.toString() === value.toString(),
    );

    return {
      ...result,
      selectedOption,
      response: {
        [stepKey]: selectedOption.value,
      },
    };
  }
}
