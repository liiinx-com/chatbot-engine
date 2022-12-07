import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { IntentManager } from './intent.manager';
import { UserModule } from 'src/user/user.module';
import { IntentProcessor } from './intent.processor';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    BullModule.registerQueue({
      name: 'intent*11557',
    }),
  ],
  providers: [IntentManager, IntentProcessor],
  exports: [IntentManager],
})
export class IntentModule {}
