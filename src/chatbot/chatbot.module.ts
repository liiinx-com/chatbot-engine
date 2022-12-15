import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WhatsappService } from './vendors/whatsapp/whatsapp.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { ChatbotService } from './chatbot.service';
import { ConfigModule } from '../config/config.module';
import { IntentModule } from 'src/intent/intent.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotMessageHandler } from './chatbot.message-handler';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    IntentModule,
    UserModule,
    // BullModule.registerQueue({
    //   name: 'intent*11557',
    // }),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, WhatsappService, ChatbotMessageHandler],
})
export class ChatbotModule {}
