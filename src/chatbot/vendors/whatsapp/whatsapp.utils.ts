import { ChatBotResponse } from 'src/chatbot/chatbot.types';
import { WhatsappIncomingMessage } from './whatapp.types';

export class WhatsappUtils {
  private static getInteractiveTextMessageFrom({ to, text }) {
    // return getInteractiveMsgFrom({
    //   to,
    //   bodyText: text,
    //   footerText: 'footer is here',
    // });
  }

  private static getSimpleTextMessageFrom(params: any) {
    const { to, text, previewUrl = false } = params;

    return {
      type: 'text',
      to,
      text: {
        body: text,
        preview_url: previewUrl,
      },
    };
  }

  private static getImageMessageFrom(params: any) {
    const { to, link, caption } = params;

    return {
      type: 'image',
      to,
      image: {
        link,
        caption,
      },
    };
  }

  private static getVideoMessageFrom(params: any) {
    const { to, link, caption } = params;

    return {
      type: 'video',
      to,
      video: {
        link,
        caption,
      },
    };
  }

  static getResponseMessageFrom(
    response: ChatBotResponse,
    { to, replyingMessageId = null, previewUrl = false },
  ): any {
    const params = { to, previewUrl, ...response };
    let result;

    if (response.type === 'text')
      result = WhatsappUtils.getSimpleTextMessageFrom(params);
    if (response.type === 'image')
      result = WhatsappUtils.getImageMessageFrom(params);
    if (response.type === 'video')
      result = WhatsappUtils.getVideoMessageFrom(params);
    // const result = ChatBotUtils.getInteractiveTextMessageFrom(params);

    if (replyingMessageId && false)
      // TODO: replyingMessageId -
      return { ...result, context: { message_id: replyingMessageId } };
    return result;
  }

  static getMessagesFromWebhook(webhook: any): WhatsappIncomingMessage[] {
    // console.log(JSON.stringify(webhook, null, 2));

    return webhook.entry
      .map(({ id, changes }) =>
        changes.map(
          ({ field, value: { contacts = [], messages = [], metadata } }) =>
            messages.map((message) => {
              const { wa_id, profile } = contacts[0];
              const {
                from,
                display_phone_number: phoneNumber,
                phone_number_id: phoneNumberId,
              } = metadata;

              return {
                id,
                business: {
                  phoneNumber,
                  phoneNumberId,
                },
                message,
                customer: {
                  phoneNumber: wa_id,
                  profile,
                },
              } as WhatsappIncomingMessage;
            }),
        ),
      )
      .flat(2);
  }
}
