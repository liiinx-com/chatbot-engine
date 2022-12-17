import { ChatBotIntent, ChatBotStep } from '../chatbot.types';
import { mainMenuIntent } from './mainMenu.intent';

export const invitationCheckStep1: ChatBotStep = {
  id: '328f5ed9-9dde-481d-91e1-753e8769a18b',
  intentId: '31231936-b5ca-4c9d-b514-5c49387e21db',
  key: 'invitationCode',
  userResponseType: 'fill-in-blank',
  text:
    'If you have received an invitation, please provide the code now ' +
    'or, you can request one through our website.',
  validatorUrl:
    'http://localhost:3001/bot/invitation-check-validator - payload response',
};

export const invitationCheckIntent: ChatBotIntent = {
  id: '31231936-b5ca-4c9d-b514-5c49387e21db',
  botId: '5e745d21-3ec3-4693-93fe-d2ce43d2323b',
  title: 'curran_invitation_check',
  type: 'intent',

  handlerModule: 'simpleIntentHandler',
  whenCompleteGotoIntentId: mainMenuIntent.id,
  steps: [invitationCheckStep1],
};
