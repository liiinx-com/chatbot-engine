import emoji from "node-emoji";

const getStep1 = ({ name }) => ({
  previousStepId: null,
  id: "hi.1",
  nextStepId: null,
  text:
    `Hi ${name}! ${emoji.get("wave")}` +
    "\n" +
    "Welcome to Liiinx's WhatsApp self-service experience.",
  key: "selectedOption",
  options: [],
});

const stepsObject = {
  "hi.1": getStep1,
};

const getStepFn = async (stepId: string) => {
  return stepsObject[stepId];
};

const getOptionsForStep = async (stepId: string, options) => {
  const targetStep = stepsObject[stepId](options);
  if (targetStep) {
    return targetStep.options;
  }
  return [];
};

const validate = async (
  stepId: string,
  value: string,
  { stepKey, stepOptions },
) => {
  return { ok: true };
};

const getNextStepFor = async (stepId: string, options: any | undefined) => {
  const result = { isIntentComplete: false, nextStep: null };
  const stepFn = await getStepFn(stepId);
  const step = stepFn(options);
  if (step.nextStepId) {
    const nextStepFn = await getStepFn(step.nextStepId);
    const nextStep = nextStepFn(options);
    return { ...result, nextStep };
  }
  return { ...result, isIntentComplete: true };
};

const getStepTextAndOptionsByStepId = async (
  stepId: string,
  options: any | undefined,
) => {
  const {
    message: {
      user: { id, name },
      text,
    },
  } = options;

  const params = { name };

  const stepFn = await getStepFn(stepId);
  const step = stepFn(params);
  const stepOptions = await getOptionsForStep(stepId, params);
  return [step.text, stepOptions, step.key];
};

const handleIntentComplete = async (
  userId: number,
  payload: any | undefined,
) => {
  const result = { gotoStepId: null };
  console.log(userId, "completed intent with", payload);
  return { ...result, gotoStepId: "invitationCheck.1" };
};

export default {
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
  validate,
  requiresUserResponse: false,
};
