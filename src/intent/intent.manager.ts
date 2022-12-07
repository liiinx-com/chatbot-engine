import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import intentHandlers from './intent-handlers/index';
import { ERRORS, IncomingMessage } from './intent.types';

@Injectable()
export class IntentManager {
  private logger = new Logger(IntentManager.name);
  private STEP_ID_DELIMITER = '.';
  private NEW_LINE = '\n';
  private intentsMap = new Map();

  constructor(private readonly userService: UserService) {}

  private async getUserActiveStepInfo(userId: number) {
    // TODO: get from db and if not existed in db then return fallback";
    const user = await this.userService.getUserById(userId);
    return user?.activeStepId
      ? { activeStepId: user.activeStepId, isNewUser: false }
      : {
          activeStepId: await this.getFallbackIntentForUser(userId),
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

  private async getFallbackIntentForUser(userId: number) {
    return 'hi.1';
    // return "newReturnOrder.1";
  }

  async getIntentAndHandlerByStepId(stepId: string) {
    if (!stepId) throw new Error(ERRORS.STEP_NOT_FOUND);

    const [intentKey] = stepId.split(this.STEP_ID_DELIMITER);

    if (this.intentsMap.has(intentKey)) {
      const intent = this.intentsMap.get(intentKey);

      const handler = intentHandlers[intentKey];
      return [intent, handler];
    }
    throw new Error(ERRORS.STEP_NOT_FOUND);
  }

  async processTextMessageForUser(
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
      console.log('---', userActiveStepId);

      // 2. Get Handler Module
      const [, handlerModule] = await this.getIntentAndHandlerByStepId(
        userActiveStepId,
      );
      const {
        getStepTextAndOptionsByStepId,
        validate: validateFn,
        getNextStepFor,
        handleIntentComplete,
        requiresUserResponse,
      } = handlerModule;

      // 3. Get Step Text and Options for the Current Step
      const [currentStepText, currentStepOptions, stepKey] =
        await getStepTextAndOptionsByStepId(userActiveStepId, {
          message,
          isNewUser: userActiveStepInfo.isNewUser,
        });
      const currentStepResponse = {
        response:
          currentStepText +
          (requiresUserResponse
            ? '\n\n' + this.getOptionsTextFromOptions(currentStepOptions)
            : ''),
      };

      if (requiresUserResponse) {
        if (inputConsumed) {
          result.push(currentStepResponse);
          console.log('1', result);
          return result;

          // return [...result, currentStepResponse];
        } else {
          const { response: validatedResponse, ok: validationOk } =
            await this.validateInputForStep(
              currentStepOptions,
              stepKey,
              userActiveStepId,
              userInput,
              validateFn,
            );

          console.log('2');
          if (!validationOk) return [...result, currentStepResponse];
          // 3. Update user output for the current active step
          await this.updateUserActiveStepId(userId, {
            changes: validatedResponse,
          });
        }
      } else {
        result.push(currentStepResponse);
        console.log('3');
      }

      // 4. Check if intent is complete
      const { isIntentComplete, nextStep } = await getNextStepFor(
        userActiveStepId,
        { message },
      );

      // 5. Handle Intent Complete and set nextStep if completed
      let gotoNextStepId: string;
      if (isIntentComplete) {
        const userCurrentOutput = await this.getUserCurrentOutput(userId);
        const { gotoStepId } = await handleIntentComplete(
          userId,
          userCurrentOutput,
          { message },
        );
        gotoNextStepId = gotoStepId //! Decide what to do next
          ? gotoStepId
          : await this.getFallbackIntentForUser(userId);
        await this.resetUserOutput(userId);
      } else {
        gotoNextStepId = nextStep.id;
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
    stepId: string,
    value: string,
    validateFn: any,
  ) {
    const result = {
      ok: true,
      response: {},
      errorCode: undefined,
    };
    if (stepOptions.length === 0) {
      const stepValidationResult = await validateFn(stepId, value, {
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
