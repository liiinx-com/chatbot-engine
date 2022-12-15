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
import { WhatsappUtils } from './vendors/whatsapp/whatsapp.utils';
import { ConfigService } from 'src/config/config.service';
import { WhatsappMessageHandler } from './vendors/whatsapp/whatsapp.message-handler';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly config: ConfigService,
    private readonly whatsappMessageHandler: WhatsappMessageHandler,
    private readonly botService: ChatbotService,
  ) {}

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

  @Post('webhook')
  async post(@Param('code') chatbotCode: string, @Req() req: Request) {
    const body: any = req.body;

    const chatbot = await this.botService.getChatbotByCode(chatbotCode);
    if (!chatbot) {
      // TODO: do something when chatbotCode is not valid or bot is disabled
      return 'OK';
    }

    if (!body.object) throw new NotFoundException();
    if (body.object !== 'whatsapp_business_account') return 'NOT_SUPPORTED';
    // if (!this.validator.validateIncomingWebhook(body).ok)
    //   return "INVALID_WEBHOOK";

    const messages = WhatsappUtils.getMessagesFromWebhook(body);
    await Promise.all(
      messages.map((msg) => this.whatsappMessageHandler.handleMessage(msg)),
    );

    return 'OK';
    // console.log("==>", response);
    // return response;
  }
}
