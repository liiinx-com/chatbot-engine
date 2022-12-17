import { ChatBotIntent, ChatBotStep } from '../../chatbot/chatbot.types';
import { mainMenuStep1 } from './mainMenu.intent';

export const invitationCheckStep1: ChatBotStep = {
  id: 'invitation-step-1',
  intentId: 'invitation-intent-1',
  key: 'invitationCode',
  userResponseType: 'fill-in-blank',
  text:
    'If you have received an invitation, please provide the code now ' +
    'or, you can request one through our website.',
  validatorUrl:
    'http://localhost:3001/bot/invitation-check-validator - payload response',
};

export const invitationCheckIntent: ChatBotIntent = {
  id: 'invitation-intent-1',
  starterStepId: 'invitation-step-1',
  botId: 'bot-id',
  title: 'curran_invitation_check',
  type: 'intent',

  handlerModule: 'simpleIntentHandler',
  whenCompleteGotoStepId: mainMenuStep1.id,
  steps: [invitationCheckStep1],
};
