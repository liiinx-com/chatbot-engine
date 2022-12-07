import { Module } from '@nestjs/common';
import { ConfigModule as ConfigurationModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ConfigModule } from './config/config.module';
import { IntentModule } from './intent/intent.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ChatbotModule, ConfigModule, ConfigurationModule.forRoot(), IntentModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
