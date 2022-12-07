import { WhatsappIncomingMessage } from './chatbot.types';
import { getInteractiveMsgFrom } from '../whatsapp.utils';

export class ChatBotUtils {
  private static getInteractiveTextMessageFrom({ to, text }) {
    // return getInteractiveMsgFrom({
    //   to,
    //   bodyText: text,
    //   footerText: 'footer is here',
    // });
  }

  private static getSimpleTextMessageFrom({ to, text, previewUrl = false }) {
    return {
      type: 'text',
      to,
      text: {
        body: text,
        preview_url: previewUrl,
      },
    };
  }

  static getTextMessageFrom({
    to,
    text,
    replyingMessageId = null,
    previewUrl = false,
  }): any {
    const params = { to, text, previewUrl };
    const result = ChatBotUtils.getSimpleTextMessageFrom(params);
    // const result = ChatBotUtils.getInteractiveTextMessageFrom(params);

    if (replyingMessageId && false)
      // TODO: replyingMessageId
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
