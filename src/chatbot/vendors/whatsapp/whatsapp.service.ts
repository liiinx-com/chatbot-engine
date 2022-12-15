import { HttpService } from '@nestjs/axios';
import { WhatsappUtils } from './whatsapp.utils';
import { catchError, firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { WhatsappResponse } from './whatapp.types';

@Injectable()
export class WhatsappService {
  private static baseUrl = 'https://graph.facebook.com/v15.0/';
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

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
