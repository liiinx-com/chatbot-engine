import { ChatBotIntent, ChatBotStep } from '../chatbot.types';
import { invitationCheckIntent } from './invitationCheck.intent';

const hiCurranStep1: ChatBotStep = {
  id: '2990a05d-5026-47c1-97dc-00c7f4210aad',
  key: 'selectedItem',
  userResponseType: 'no-response',
  text:
    `Hi $name!` +
    '\n' +
    "Welcome to Liiinx's WhatsApp self-service experience.",
};

export const hiCurranIntent: ChatBotIntent = {
  id: 'hi-intent-id',
  botId: '5e745d21-3ec3-4693-93fe-d2ce43d2323b',
  title: 'curran-hi',
  type: 'intent',

  handlerModule: 'static-intent-handler',
  whenCompleteGotoIntentId: invitationCheckIntent.id,
  steps: [hiCurranStep1],
};
