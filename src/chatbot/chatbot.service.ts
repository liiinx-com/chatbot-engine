import { Injectable, Logger } from '@nestjs/common';
import { ChatBot } from './chatbot.types';

const bots: ChatBot[] = [
  {
    id: '5e745d21-3ec3-4693-93fe-d2ce43d2323b',
    verifyToken: 'pC5N~6GTKYh1U,x:gT,z~aRVMEc_',
    code: '11557', //'7vxyisJLm1r3M2U6fVKYPDBzQD8Ax3',
    title: '510 Curran Place',
    description: '',
    mainStepCode: 'mainMenu.1',
    status: 'ACTIVE',
  },
];

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  async getChatbotByCode(code: string) {
    return bots.find((bot) => bot.code === code);
  }
}
