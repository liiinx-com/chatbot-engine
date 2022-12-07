import {
  Controller,
  NotFoundException,
  Req,
  Param,
  Post,
  Get,
  Query,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatBotUtils } from './chatbot.utils';
import { ConfigService } from 'src/config/config.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly config: ConfigService) {}

  @Get('webhook')
  get(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const { verifyToken } = this.config.getWhatsappConfig();
    if (mode && mode === 'subscribe' && token && token === verifyToken) {
      return challenge;
    }
    throw new HttpException('INVALID_VERIFY_TOKEN', 403);
  }

  @Post('webhook:tenant-id')
  async post(@Param('tenant-id') tenantId: string, @Req() req: Request) {
    const body: any = req.body;

    // TODO: apply tenant-id

    if (!body.object) throw new NotFoundException();
    if (body.object !== 'whatsapp_business_account') return 'NOT_SUPPORTED';
    // if (!this.validator.validateIncomingWebhook(body).ok)
    //   return "INVALID_WEBHOOK";

    const messages = ChatBotUtils.getMessagesFromWebhook(body);
    // await Promise.all(
    //   messages.map((msg) => this.botService.handleMessage(msg)),
    // );

    return 'OK';
    // console.log("==>", response);
    // return response;
  }
}
