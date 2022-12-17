import { Injectable, Logger } from '@nestjs/common';

import { bots } from '../intent/db/index';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  async getChatbotByCode(code: string) {
    return bots.find((bot) => bot.code === code);
  }
}
