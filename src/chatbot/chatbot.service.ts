import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
}
