import { WhatsappUtils } from './whatsapp.utils';
import { Injectable, Logger } from '@nestjs/common';
import { WhatsappIncomingMessage, WhatsappResponse } from './whatapp.types';
import { IntentManager } from 'src/intent/intent.manager';
import { UserService } from 'src/user/user.service';

import intentsObject from '../../intents';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class WhatsappMessageHandler {
  private readonly logger = new Logger(WhatsappMessageHandler.name);

  constructor(
    private readonly userService: UserService,
    private readonly intentManager: IntentManager,
    private readonly whatsappService: WhatsappService,
  ) {
    this.intentManager.loadIntents({ intentsObject: intentsObject.intents });
  }

  async handleMessage(receivedMessage: WhatsappIncomingMessage) {
    const {
      customer: { phoneNumber },
      business: { phoneNumberId },
      message: { type },
    } = receivedMessage;

    const { id: userId } = await this.userService.getUserByPhone(phoneNumber);

    let responses: any[];
    if (type === 'text')
      responses = await this.textMessageHandler(userId, receivedMessage);
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
    userId: number,
    receivedMessage: WhatsappIncomingMessage,
  ): Promise<any> {
    const {
      customer: { profile },
      message: {
        text: { body: receivedInput },
      },
      customer: {
        profile: { name },
      },
    } = receivedMessage;

    const responses = await this.intentManager.processTextMessageForUser(
      userId,
      {
        user: { id: userId, name: profile.name },
        text: receivedInput,
      },
    );

    return responses.map((r: any) =>
      WhatsappUtils.getTextMessageFrom({
        text: r.response,
        to: receivedMessage.customer.phoneNumber,
        replyingMessageId: receivedMessage.message.id,
      }),
    );
  }
}
