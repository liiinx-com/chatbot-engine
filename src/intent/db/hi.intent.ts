import { ChatBotIntent, ChatBotStep } from '../../chatbot/chatbot.types';
import { invitationCheckIntent } from './invitationCheck.intent';

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

  handlerModule: 'simpleIntentHandler',
  whenCompleteGotoIntentId: invitationCheckIntent.id,
  steps: [hiCurranStep1],
};
