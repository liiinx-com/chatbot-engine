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
    const nextStepFn = await getStepFn(step.nextStepId);
    const nextStep = nextStepFn(options);
    return { ...result, nextStep };
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

  const params = { name };

  console.log('s->', step);
  console.log('i->', intent);

  // const stepFn = await getStepFn(stepId);
  // const step = stepFn(params);
  // const stepOptions = await getOptionsForStep(stepId, params);
  return ['step.text', 'stepOptions', 'step.key'];
};

const handleIntentComplete = async (
  step: ChatBotStep,
  intent: ChatBotIntent,
  userId: number,
  payload: any | undefined,
) => {
  const result = { gotoStepId: null };
  console.log(userId, 'completed intent with', payload);
  return { ...result, gotoStepId: 'invitationCheck.1' };
};

export default {
  getStepTextAndOptionsByStep,
  getNextStepFor,
  handleIntentComplete,
  validate,
  requiresUserResponse: false,
};
