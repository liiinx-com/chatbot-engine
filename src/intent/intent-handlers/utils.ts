export const getStepFn = async (stepsObject: any, stepId: string) => {
  return stepsObject[stepId];
};

export const getOptionsForStep = async (
  stepsObject: any,
  stepId: string,
  options: any,
) => {
  const targetStep = stepsObject[stepId](options);
  if (targetStep) {
    return targetStep.options;
  }
  return [];
};

export const getPleaseUseTheProvidedOptions = () =>
  "Please use one of the provided options";

const getLocationMessage = ({}) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "{{Recipient-Phone-Number}}",
  type: "location",
  location: {
    latitude: "43.5856655",
    longitude: "-79.6463553",
    name: "Home",
    address: "510 Curran Pl",
  },
});

const getAudioMessage = ({}) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "{{Recipient-Phone-Number}}",
  type: "audio",
  audio: {
    link: "http(s)://audio-url",
  },
});

const getVideoMessage = ({}) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "{{Recipient-Phone-Number}}",
  type: "video",
  video: {
    link: "<http(s)://video-url>",
    caption: "<VIDEO_CAPTION_TEXT>",
  },
});

const getImageMessage = ({}) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "{{Recipient-Phone-Number}}",
  type: "image",
  image: {
    link: "https://lh3.googleusercontent.com/RelgkUizVvelzH_87PbslTmGDKtVkGH8n0EdajiPZaNRJkkXedlaxEM8D35HjgCOP9yzBXFxnwPnPBjyfPYMgYKyikKsGyLpPosNce02mQ=s660",
  },
});

const getReactToMessage = ({}) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "{{Recipient-Phone-Number}}",
  type: "reaction",
  reaction: {
    message_id: "<WAM_ID>",
    emoji: "<EMOJI>",
  },
});

const getStickerMessage = ({}) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "{{Recipient-Phone-Number}}",
  type: "sticker",
  sticker: {
    link: "<http(s)://sticker-url>",
  },
});

// send PUT request
const markAsRead = ({}) => ({
  messaging_product: "whatsapp",
  status: "read",
  message_id: "<INCOMING_MSG_ID>",
});

const listInteractiveObject = {
  type: "list",
  header: {
    type: "text",
    text: "Select the food item you would like",
  },
  body: {
    text: "You will be presented with a list of options to choose from",
  },
  footer: {
    text: "All of them are freshly packed",
  },
  action: {
    button: "Order",
    sections: [
      {
        title: "Section 1 - Fruit",
        rows: [
          {
            id: "1",
            title: "Apple",
            description: "Dozen",
          },
          {
            id: "2",
            title: "Orange",
            description: "Dozen",
          },
        ],
      },
      {
        title: "Section 2 - Vegetables",
        rows: [
          {
            id: "3",
            title: "Spinach",
            description: "1kg ",
          },
          {
            id: "2",
            title: "Broccoli",
            description: "1kg",
          },
        ],
      },
    ],
  },
};

const sampleInteractiveMsg = ({ to }) => ({
  to,
  type: "interactive",
  interactive: {
    type: "button",
    body: {
      text: "optional body text",
    },
    footer: {
      text: "optional footer text",
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: "BUTTON_ID_1",
            title: "TITLE_1",
          },
        },
        {
          type: "reply",
          reply: {
            id: "BUTTON_ID_3",
            title: "TITLE_3",
          },
        },
        {
          type: "reply",
          reply: {
            id: "BUTTON_ID_2",
            title: "TITLE_2",
          },
        },
      ],
    },
  },
});
