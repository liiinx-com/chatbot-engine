// import emoji from "node-emoji";
import { getStepFn, getOptionsForStep } from "../utils";

const getStep1 = ({ name }) => ({
  previousStepId: null,
  id: "mainMenu.1",
  nextStepId: null,
  text: `How can I help you today, ${name}?`,
  key: "selectedOption",
  options: [
    {
      id: "mainMenu*1*1",
      order: 1,
      label: "How it works",
      value: "how_it_works",
      numericValue: "1",
    },
    {
      id: "mainMenu*1*2",
      order: 1,
      label: "New Amazon/Walmart Return Pickup",
      value: "new_return_order",
      numericValue: "2",
    },
    {
      id: "mainMenu*1*3",
      order: 3,
      label: "My incoming pickups",
      value: "my_pickups",
      numericValue: "3",
    },
    {
      id: "mainMenu*1*4",
      order: 4,
      label: "Pricing",
      value: "pricing",
      numericValue: "4",
    },
  ],
});

const stepsObject = {
  "mainMenu.1": getStep1,
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

  return { ...result, gotoStepId: "newReturnOrder.1" };
};

export default {
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
  validate,
  requiresUserResponse: true,
};
