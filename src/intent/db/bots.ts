import {
  ChatBot,
  ChatBotIntent,
  ChatBotStep,
} from '../../chatbot/chatbot.types';
import { buildingInfoIntent } from './buildingInfo';
import { hiCurranIntent as intent1, hiCurranStep1 as step1 } from './hi.intent';
import {
  invitationCheckIntent as intent2,
  invitationCheckStep1 as step2,
} from './invitationCheck.intent';
import {
  mainMenuStep1 as step3,
  mainMenuIntent as intent3,
} from './mainMenu.intent';

const curranBot: ChatBot = {
  id: '5e745d21-3ec3-4693-93fe-d2ce43d2323b',
  verifyToken: 'pC5N~6GTKYh1U,x:gT,z~aRVMEc_',
  code: '11557', //'7vxyisJLm1r3M2U6fVKYPDBzQD8Ax3',
  title: '510 Curran Place',
  description: '',
  mainIntentId: 'hi-intent-id.2990a05d-5026-47c1-97dc-00c7f4210aad', // TODO: it should created automatically
  status: 'ACTIVE',
};

export const bots: ChatBot[] = [curranBot];
export const intents: ChatBotIntent[] = [
  buildingInfoIntent,
  intent1,
  intent2,
  intent3,
];
export const steps: ChatBotStep[] = [step1, step2, step3];
