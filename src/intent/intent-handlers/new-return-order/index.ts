import { getStepFn, getOptionsForStep } from "../utils";

const stepsObject = {
  "newReturnOrder.1": () => ({
    previousStepId: null,
    id: "newReturnOrder.1",
    nextStepId: "newReturnOrder.2",
    text: "What retailer are you returning this package to?",
    key: "retailer",
    options: [
      {
        id: "newReturnOrder.1.1",
        order: 1,
        label: "Amazon",
        value: "AMAZON",
        numericValue: "1",
      },
      {
        id: "newReturnOrder.1.2",
        order: 2,
        label: "Walmart",
        value: "WALMART",
        numericValue: "2",
      },
    ],
  }),
  "newReturnOrder.2": () => ({
    previousStepId: "newReturnOrder.1",
    id: "newReturnOrder.2",
    nextStepId: "newReturnOrder.3",
    text: "What size is the package?",
    key: "size",
    options: [
      {
        id: "newReturnOrder.2.1",
        order: 1,
        label: "Small",
        value: "SMALL",
        numericValue: "1",
      },
      {
        id: "newReturnOrder.2.2",
        order: 2,
        label: "Medium",
        value: "MEDIUM",
        numericValue: "2",
      },
    ],
  }),
  "newReturnOrder.3": () => ({
    previousStepId: "newReturnOrder.2",
    id: "newReturnOrder.3",
    nextStepId: null,
    text: "Does it need a shipping box?",
    key: "shippingBox",
    options: [
      {
        id: "newReturnOrder.3.1",
        order: 1,
        label: "Yes",
        value: true,
        numericValue: "1",
      },
      {
        id: "newReturnOrder.3.2",
        order: 2,
        label: "No",
        value: false,
        numericValue: "2",
      },
    ],
  }),
};

// const getNextStepFor = async (stepId: string, options: any | undefined) => {
//   const getStep = await getStepFn(stepsObject);

//   const result = { isIntentComplete: false, nextStep: null };
//   const step = await getStep(stepId);
//   if (step.nextStepId) {
//     const nextStep = await getStep(step.nextStepId);
//     return { ...result, nextStep };
//   }
//   return { ...result, isIntentComplete: true };
// };

// const getStepTextAndOptionsByStepId = async (
//   stepId: string,
//   options: any | undefined,
// ) => {
//   const {
//     message: {
//       user: { id, name },
//       text,
//     },
//   } = options;
//   const getStep = await getStepFn(stepsObject);
//   const getOptionsForStep = await getOptionsForStepFn(stepsObject);

//   const step = await getStep(stepId);
//   const stepOptions = await getOptionsForStep(stepId);
//   return [step.text, stepOptions, step.key];
// };

// const handleIntentComplete = async (userId: number, payload: any) => {
//   const result = { gotoStepId: "mainMenu.1" };

//   console.log(userId, "completed intent with", payload);

//   return result;
// };

// const validate = async (
//   stepId: string,
//   value: string,
//   { stepKey, stepOptions },
// ) => {
//   return { ok: true };
// };

// export default {
//   getStepTextAndOptionsByStepId,
//   getNextStepFor,
//   handleIntentComplete,
//   validate,
//   requiresUserResponse: true,
// };

const validate = async (
  stepId: string,
  value: string,
  { stepKey, stepOptions },
) => {
  return { ok: false };
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
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
  validate,
  requiresUserResponse: true,
};
