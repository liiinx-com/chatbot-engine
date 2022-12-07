import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { UserModule } from 'src/user/user.module';
import { IntentManager } from './intent.manager';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    BullModule.registerQueue({
      name: 'intent*11557',
    }),
  ],
  providers: [IntentManager],
  exports: [IntentManager],
})
export class IntentModule {}
