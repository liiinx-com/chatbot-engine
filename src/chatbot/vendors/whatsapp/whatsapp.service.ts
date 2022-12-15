import { HttpService } from '@nestjs/axios';
import { WhatsappUtils } from './whatsapp.utils';
import { catchError, firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { WhatsappIncomingMessage, WhatsappResponse } from './whatapp.types';
import { IntentManager } from 'src/intent/intent.manager';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WhatsappService {
  private static baseUrl = 'https://graph.facebook.com/v15.0/';
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly intentManager: IntentManager,
  ) {
    //   this.intentManager.loadIntents({ intentsObject: intentsObject.intents });
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
      return this.send(
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

  private getUrl({ phoneNumberId }) {
    return WhatsappService.baseUrl + phoneNumberId + '/messages';
  }

  private getHeaders() {
    return {
      Authorization: 'Bearer ' + this.config.getWhatsappConfig().accessToken,
    };
  }

  async send(responses: WhatsappResponse[]) {
    const headers = this.getHeaders();
    const result = [];

    for (const response of responses) {
      const { data, phoneNumberId, recipient_type } = response;
      const updatedPayload = {
        ...data,
        recipient_type,
        messaging_product: 'whatsapp',
      };

      console.log('sending => ', JSON.stringify(updatedPayload, null, 2));

      const { data: responseData } = await firstValueFrom(
        this.http
          .post(this.getUrl({ phoneNumberId }), updatedPayload, {
            headers,
          })
          .pipe(
            catchError((error: any) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );
      result.push(responseData);
    }

    return result;
  }
}
