import { Injectable } from '@nestjs/common';
import { RedisConfig, WhatsappConfig } from './config.types';
import { ConfigService as ConfigurationService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configurationService: ConfigurationService) {}

  getRedisConfig(): RedisConfig {
    const url = this.configurationService.getOrThrow<string>('REDIS_URL');
    return { url } as RedisConfig;
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
