import emoji from "node-emoji";
import { getStepFn, getOptionsForStep } from "../utils";

const getStep1 = ({ name }) => ({
  previousStepId: null,
  id: "invitationCheck.1",
  nextStepId: null,
  text:
    "If you have received an invitation, please provide the code now " +
    "or, you can request one through our website.",
  key: "invitationCode",
  options: [],
});

const stepsObject = {
  "invitationCheck.1": getStep1,
};

const validate = async (
  stepId: string,
  value: string,
  { stepKey, stepOptions },
) => {
  const result = { ok: false };

  if (value === "3302code") return { ...result, ok: true };

  return result;
};

const getNextStepFor = async (stepId: string, options: any | undefined) => {
  const result = { isIntentComplete: false, nextStep: null };
  const stepFn = await getStepFn(stepsObject, stepId);
  const step = stepFn(options);
  if (step.nextStepId) {
    const nextStepFn = await getStepFn(stepsObject, step.nextStepId);
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

  const stepFn = await getStepFn(stepsObject, stepId);
  const step = stepFn(params);
  const stepOptions = await getOptionsForStep(stepsObject, stepId, params);
  return [step.text, stepOptions, step.key];
};

const handleIntentComplete = async (
  userId: number,
  payload: any | undefined,
) => {
  const result = { gotoStepId: null };

  console.log(userId, "completed intent with", payload);

  return { ...result, gotoStepId: "mainMenu.1" };
};

export default {
  requiresUserResponse: true,
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
  validate,
};
