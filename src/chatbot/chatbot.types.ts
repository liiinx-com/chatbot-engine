export class ChatBot {
  id: string;
  verifyToken: string;
  code: string;
  title: string;
  description: string;
  mainIntentId: string;
  status: string;
}

export class ChatBotIntent {
  constructor() {
    this.steps = [];
  }

  id: string;
  botId: string;
  title: string;
  type: 'intent' | 'menu';

  handlerModule: 'simpleIntentHandler';

  // one of these two should be set
  whenCompleteGotoIntentId?: string;
  WhenCompleteCallbackUrl?: string;

  // onCompleteMessageId: '', // TODO: 0.1.x
  steps: ChatBotStep[];
}

export class ChatBotStep {
  id: string;
  intentId: string;
  previousStepId?: string;
  nextStepId?: string;
  key: string;
  text: string;
  userResponseType: 'no-response' | 'multiple-choice' | 'fill-in-blank'; // when userResponseType=multiple-choice => built-in validator goes first
  userOptionsType?: 'static';

  options?: StepOption[]; // when responseType == multiple-choice
  validatorUrl?: string; // when responseType == fill-in-blank | multiple-choice
  // textAndOptionsUrl: "" // TODO: 0.1.x
  // onCompleteCallbackUrl, // TODO: 0.3.x
}

export class StepOption {
  id: string;
  order: number;
  label: string;
  value: string;
  numericValue: number;
}
