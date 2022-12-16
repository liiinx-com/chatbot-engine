import { ChatBot, ChatBotIntent } from '../chatbot.types';
import { hiCurranIntent as intent1 } from './hi.intent';

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
export const intents: ChatBotIntent[] = [intent1];
