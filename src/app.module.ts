import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { IntentModule } from './intent/intent.module';
import { ConfigService } from './config/config.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ConfigModule as ConfigurationModule } from '@nestjs/config';

@Module({
  imports: [
    ChatbotModule,
    ConfigModule,
    ConfigurationModule.forRoot(),
    IntentModule,
    UserModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { host, username, password } = configService.getRedisConfig();
        return {
          redis: {
            host,
            // username,
            password,
            port: 17827,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
