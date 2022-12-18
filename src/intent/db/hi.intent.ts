import { ChatBotIntent, ChatBotStep } from '../../chatbot/chatbot.types';
import { invitationCheckStep1 } from './invitationCheck.intent';

export const hiCurranStep1: ChatBotStep = {
  id: 'hi-step1',
  intentId: 'hi-intent-id',
  key: 'selectedItem',
  userResponseType: 'no-response',
  text:
    `Hi $name!` +
    '\n' +
    "Welcome to Liiinx's WhatsApp self-service experience.",
};

export const hiCurranIntent: ChatBotIntent = {
  id: 'hi-intent-id',
  botId: 'bot-id',
  title: 'curran-hi',
  type: 'intent',
  starterStepId: 'hi-step1',

  responses: [
    {
      type: 'image',
      link: 'https://jbmsmartstart.in/wp-content/uploads/2021/05/silhouette-man-jumping-from-failure-success-1600x900.jpg',
      caption: 'sample intent response',
      id: '1',
    },
  ],

  handlerModule: 'simpleIntentHandler',
  whenCompleteGotoStepId: invitationCheckStep1.id,
  steps: [hiCurranStep1],
};
