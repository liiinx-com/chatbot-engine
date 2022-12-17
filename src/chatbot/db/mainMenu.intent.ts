import { ChatBotIntent, ChatBotStep, StepOption } from '../chatbot.types';

const mainMenuStep1Options: StepOption[] = [
  {
    id: 'someId1',
    order: 1,
    label: 'How it works',
    value: 'how_it_works',
    numericValue: 1,
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
  },
  {
    id: 'someId4',
    order: 4,
    label: 'Pricing',
    value: 'pricing',
    numericValue: 4,
  },
];

export const mainMenuStep1: ChatBotStep = {
  id: '24a22f9f-ffad-4f7a-b188-6593f5cf1f9e',
  intentId: '61d6ccbd-3143-4a96-8048-05c7208f801b',
  key: 'selectedItem',
  userResponseType: 'multiple-choice',

  userOptionsType: 'static',
  text: 'How can I help you today, ${name}?',
  options: mainMenuStep1Options,
};

export const mainMenuIntent: ChatBotIntent = {
  id: '61d6ccbd-3143-4a96-8048-05c7208f801b',
  botId: '5e745d21-3ec3-4693-93fe-d2ce43d2323b',
  title: 'curran-main-menu',
  type: 'menu',

  handlerModule: 'simpleIntentHandler',
  steps: [mainMenuStep1],
};
