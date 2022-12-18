import { WhatsappUtils } from './whatsapp.utils';
import { Injectable, Logger } from '@nestjs/common';
import { WhatsappIncomingMessage, WhatsappResponse } from './whatapp.types';
import { IntentManager } from 'src/intent/intent.manager';
import { UserService } from 'src/user/user.service';
import { WhatsappService } from './whatsapp.service';
import { ChatBotResponse } from 'src/chatbot/chatbot.types';

@Injectable()
export class WhatsappMessageHandler {
  private readonly logger = new Logger(WhatsappMessageHandler.name);

  constructor(
    private readonly userService: UserService,
    private readonly intentManager: IntentManager,
    private readonly whatsappService: WhatsappService,
  ) {}

  async handleMessage(
    chatbotId: string,
    receivedMessage: WhatsappIncomingMessage,
  ) {
    const {
      customer: { phoneNumber },
      business: { phoneNumberId },
      message: { type },
    } = receivedMessage;

    const { id: userId } = await this.userService.getUserByPhone(phoneNumber);

    let responses: any[];
    if (type === 'text')
      responses = await this.textMessageHandler(
        chatbotId,
        userId,
        receivedMessage,
      );
    // console.log("via", responses);

    if (responses) {
      return this.whatsappService.send(
        responses.map(
          (r: any) =>
            new WhatsappResponse({
              data: r,
              phoneNumberId,
            }),
        ),
      );
    }

    return Promise.resolve('NOT_SUPPORTED_MESSAGE_TYPE');
  }

  async textMessageHandler(
    chatbotId: string,
    userId: number,
    receivedMessage: WhatsappIncomingMessage,
  ): Promise<ChatBotResponse[]> {
    const {
      customer: { profile },
      message: {
        text: { body: receivedInput },
      },
      customer: {
        profile: { name },
      },
    } = receivedMessage;

    const responses: ChatBotResponse[] =
      await this.intentManager.processTextMessageForUser(chatbotId, userId, {
        user: { id: userId, name: profile.name },
        text: receivedInput,
      });

    console.log('-------------');
    console.log(JSON.stringify(responses, null, 2));
    console.log('-------------');

    return responses.map((r: ChatBotResponse) => {
      console.log('jik-jik', r);
      return WhatsappUtils.getResponseMessageFrom(r, {
        to: receivedMessage.customer.phoneNumber,
        replyingMessageId: receivedMessage.message.id,
      });
    });
  }
}
