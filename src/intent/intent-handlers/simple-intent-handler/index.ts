import { ChatBotIntent, ChatBotStep } from 'src/chatbot/chatbot.types';

const getStep1 = ({ name }) => ({
  previousStepId: null,
  id: 'hi.1',
  nextStepId: null,
  text:
    // `Hi ${name}! ${emoji.get('wave')}` +
    `Hi ${name}!` +
    '\n' +
    "Welcome to Liiinx's WhatsApp self-service experience.",
  key: 'selectedOption',
  options: [],
});

const stepsObject = {
  'hi.1': getStep1,
};

const getStepFn = async (stepId: string) => {
  return stepsObject[stepId];
};

const getOptionsForStep = async (stepId: string, options: any) => {
  const targetStep = stepsObject[stepId](options);
  if (targetStep) {
    return targetStep.options;
  }
  return [];
};

const validate = async (
  step: ChatBotStep,
  // intent: ChatBotIntent,
  value: string,
  { stepKey, stepOptions },
) => {
  return { ok: true };
};

const getNextStepFor = async (
  step: ChatBotStep,
  intent: ChatBotIntent,
  options: any | undefined,
) => {
  const result = { isIntentComplete: false, nextStep: null };

  if (step.nextStepId) {
    return { ...result, nextStepId: step.nextStepId };
  }
  return { ...result, isIntentComplete: true };
};

const getStepTextAndOptionsByStep = async (
  step: ChatBotStep,
  intent: ChatBotIntent,
  options: any | undefined,
) => {
  const {
    message: {
      user: { id, name },
      text,
    },
  } = options;

  let stepOptions = [];
  const stepRequiresUserInput = step.userResponseType !== 'no-response';
  if (step.userResponseType === 'multiple-choice') {
    stepOptions = step.options;
  }

  return [step.text, stepOptions, step.key, stepRequiresUserInput];
};

const handleIntentComplete = async (
  intent: ChatBotIntent,
  userId: number,
  payload: any | undefined,
) => {
  const result = { gotoStepId: null };
  console.log(userId, 'completed intent ' + intent.title + ' with', payload);
  if (intent.whenCompleteGotoStepId) {
    result.gotoStepId = intent.whenCompleteGotoStepId;
  }
  return result;
};

export default {
  getStepTextAndOptionsByStep,
  getNextStepFor,
  handleIntentComplete,
  validate,
  requiresUserResponse: false,
};
