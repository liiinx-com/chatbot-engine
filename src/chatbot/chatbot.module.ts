import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ConfigModule } from '../config/config.module';
import { ChatbotService } from './chatbot.service';
import { HttpModule } from '@nestjs/axios';
import { IntentModule } from 'src/intent/intent.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, HttpModule, IntentModule, UserModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
