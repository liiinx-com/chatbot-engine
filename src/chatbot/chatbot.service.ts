import { Injectable, Logger } from '@nestjs/common';

import db from '../intent/db/index';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  async getChatbotByCode(code: string) {
    return db.bots.find((bot) => bot.code === code);
  }
}
