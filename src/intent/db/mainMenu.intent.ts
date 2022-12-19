import {
  ChatBotIntent,
  ChatBotStep,
  StepOption,
} from '../../chatbot/chatbot.types';

const mainMenuStep1Options: StepOption[] = [
  {
    id: 'someId0',
    order: 1,
    label: 'Building Contact',
    value: 'building-contact',
    numericValue: 1,
    gotoStepId: 'building-info-menu-1',
  },
  {
    id: 'someId1',
    order: 1,
    label: 'How it works',
    value: 'how_it_works',
    numericValue: 2,
    responses: [
      {
        type: 'text',
        text: 'you have selected how it works',
      },
    ],
  },
  {
    id: 'someId2',
    order: 1,
    label: 'New Amazon/Walmart Return Pickup',
    value: 'new_return_order',
    numericValue: 3,
    gotoStepId: 'invitation-step-1',
  },
  {
    id: 'someId3',
    order: 3,
    label: 'My incoming pickups',
    value: 'my_pickups',
    numericValue: 4,
    responses: [
      {
        type: 'image',
        link: 'https://media.licdn.com/dms/image/C4E12AQGMhuVyjTdDgA/article-cover_image-shrink_423_752/0/1562962503840?e=1677110400&v=beta&t=qiSvcZoCed8mAwiCm85Mjd3QlIBlQoQGZqHGYdzJcFs',
        caption: 'We made it possible!',
      },
    ],
  },
  {
    id: 'someId4',
    order: 4,
    label: 'Pricing',
    value: 'pricing',
    numericValue: 5,
    responses: [
      {
        type: 'text',
        text: 'Watch this video please \n\n https://youtu.be/X9JExlvPwcs?t=16',
        previewUrl: true,
      },
    ],
  },
];

export const mainMenuStep1: ChatBotStep = {
  id: 'main-menu-step-1',
  intentId: 'main-menu-intent-1',
  key: 'selectedItem',
  userResponseType: 'multiple-choice',

  // userOptionsType: 'static',
  text: 'How can I help you today, ${name}?',
  options: mainMenuStep1Options,
};

export const mainMenuIntent: ChatBotIntent = {
  id: 'main-menu-intent-1',
  botId: 'bot-id',
  title: 'curran-main-menu',
  type: 'menu',
  starterStepId: 'main-menu-step-1',

  handlerModule: 'simpleIntentHandler',
  whenCompleteGotoStepId: 'main-menu-step-1',
  steps: [mainMenuStep1],
};
  type: 'menu',
  starterStepId: 'main-menu-step-1',

  handlerModule: 'simpleIntentHandler',
  whenCompleteGotoStepId: 'main-menu-step-1',
  steps: [mainMenuStep1],
};
