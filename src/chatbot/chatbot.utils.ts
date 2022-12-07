import { WhatsappIncomingMessage } from './chatbot.types';

export class ChatBotUtils {
  static getTextMessageFrom({
    to,
    text,
    replyingMessageId = null,
    previewUrl = false,
    // interactiveMessage = true,
  }): any {
    // if (interactiveMessage)
    //   return {
    //     to,
    //     type: "interactive",
    //     interactive: listInteractiveObject,
    //   };

    const result: any = {
      type: 'text',
      to,
      text: {
        body: text,
        footer: 'test footer',
        header: {
          type: 'text',
          text: 'header-content',
        },
        preview_url: previewUrl,
      },
    };
    if (replyingMessageId && false)
      result.context = { message_id: replyingMessageId };
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
