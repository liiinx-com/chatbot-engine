import {
  ChatBotIntent,
  ChatBotStep,
  StepOption,
} from '../../chatbot/chatbot.types';

const mainMenuStep1Options: StepOption[] = [
  {
    id: 'someId1',
    order: 1,
    label: 'How it works',
    value: 'how_it_works',
    numericValue: 1,
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
    numericValue: 2,
  },
  {
    id: 'someId3',
    order: 3,
    label: 'My incoming pickups',
    value: 'my_pickups',
    numericValue: 3,
    responses: [
      {
        type: 'video',
        link: 'https://youtu.be/X9JExlvPwcs?t=16',
        caption: 'Keep Working Hard!',
      },
    ],
  },
  {
    id: 'someId4',
    order: 4,
    label: 'Pricing',
    value: 'pricing',
    numericValue: 4,
    responses: [
      {
        type: 'text',
        text: 'Watch this video please https://youtu.be/X9JExlvPwcs?t=16',
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

  userOptionsType: 'static',
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
