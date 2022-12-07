import { Injectable } from '@nestjs/common';
import { RedisConfig, WhatsappConfig } from './config.types';
import { ConfigService as ConfigurationService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configurationService: ConfigurationService) {}

  getRedisConfig(): RedisConfig {
    // const host = this.configurationService.getOrThrow<string>('REDIS_URL');
    return {
      host: 'redis-17827.c83.us-east-1-2.ec2.cloud.redislabs.com',
      password: 'r7VOBlSwy9YxTjOKQ8JxMNFxv5eJrsJm',
      username: 'default',
    } as RedisConfig;
  }

  getWhatsappConfig(): WhatsappConfig {
    const verifyToken = this.configurationService.getOrThrow<string>(
      'WHATSAPP_VERIFY_TOKEN',
    );
    const accessToken = this.configurationService.getOrThrow<string>(
      'WHATSAPP_ACCESS_TOKEN',
    );
    return { verifyToken, accessToken } as WhatsappConfig;
  }
}
