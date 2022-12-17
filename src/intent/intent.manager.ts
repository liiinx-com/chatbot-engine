import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import intentHandlers from './intent-handlers/index';
import { ERRORS, IncomingMessage } from './intent.types';
import { steps, intents } from './db/index';

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
    //TODO get bot default intent and then
    // starterStepId for the intent
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
  ): Promise<any> {
    const result = [];
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
        requiresUserResponse, // TODO: candidate to remove. when validateFn is available means it requires-user-response
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
      const currentStepResponse = {
        response:
          currentStepText +
          (stepRequiresUserInput
            ? '\n\n' + this.getOptionsTextFromOptions(currentStepOptions)
            : ''),
      };

      if (stepRequiresUserInput) {
        if (inputConsumed) {
          result.push(currentStepResponse);
          return result;
        } else {
          const { response: validatedResponse, ok: validationOk } =
            await this.validateInputForStep(
              currentStepOptions,
              stepKey,
              userCurrentStep,
              userInput,
              validateFn,
            );

          if (!validationOk) return [...result, currentStepResponse];
          // 3. Update user output for the current active step
          await this.updateUserActiveStepId(userId, {
            changes: validatedResponse,
          });
        }
      } else {
        result.push(currentStepResponse);
      }

      // 4. Check if intent is complete
      const { isIntentComplete, nextStepId } = await getNextStepFor(
        userActiveStepId,
        { message },
      );

      // 5. Handle Intent Complete and set nextStep if completed
      let gotoNextStepId: string;
      if (isIntentComplete) {
        const userCurrentOutput = await this.getUserCurrentOutput(userId);
        const { gotoStepId } = await handleIntentComplete(
          userCurrentIntent,
          userId,
          userCurrentOutput,
        );

        // Add to queue
        const job = await this.intentQueue.add('complete', {
          shilang: { output: userCurrentOutput, message },
        });
        this.logger.log(`[i] job id ${job.id} registered on queue`);

        gotoNextStepId = gotoStepId //! Decide what to do next
          ? gotoStepId
          : await this.getFallbackStepIdForUser(userId);
        await this.resetUserOutput(userId);
      } else {
        gotoNextStepId = nextStepId;
      }

      await this.updateUserActiveStepId(userId, {
        stepId: gotoNextStepId,
      });
      inputConsumed = true;
    } while (true);
  }

  //   private async handleCompleteAndGetNextStepId({
  //     handleIntentCompleteFn,
  //     userId,
  //     validatedResponse,
  //     message,
  //   }) {
  //     const userCurrentOutput = await this.getUserCurrentOutput(userId);
  //     const { gotoStepId } = await handleIntentCompleteFn(
  //       userId,
  //       {
  //         ...userCurrentOutput,
  //         ...validatedResponse,
  //       },
  //       { message },
  //     );

  //     return gotoStepId
  //       ? gotoStepId
  //       : await this.getFallbackIntentForUser(userId);
  //   }

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
          response: {
            [stepKey]: value,
          },
        };
    }

    const validValues = stepOptions.map(({ numericValue }) => numericValue);
    if (!validValues.includes(value.toString()))
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        response: null,
      };

    const selectedOption = stepOptions.find(
      ({ numericValue }) => numericValue === value.toString(),
    );

    return {
      ...result,
      response: {
        [stepKey]: selectedOption.value,
      },
    };
  }
}
