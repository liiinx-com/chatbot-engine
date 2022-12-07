import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { UserModule } from 'src/user/user.module';
import { IntentManager } from './intent.manager';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [IntentManager],
  exports: [IntentManager],
})
export class IntentModule {}
