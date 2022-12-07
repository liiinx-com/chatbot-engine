import { Module } from '@nestjs/common';
import { ConfigModule as ConfigurationModule } from '@nestjs/config';
import { ConfigService } from './config.service';

@Module({
  imports: [ConfigurationModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
