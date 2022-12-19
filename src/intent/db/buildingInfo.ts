import { ChatBotIntent, ChatBotStep } from '../../chatbot/chatbot.types';

export const buildingInfoStep1: ChatBotStep = {
  id: 'building-info-menu-1',
  intentId: 'building-info-intent-id',
  key: 'selectedItem',
  text: 'please select your thing',
  userResponseType: 'multiple-choice',
  options: [
    {
      id: 'building-info-menu-option-1',
      label: 'Management Contact Info',
      numericValue: 1,
      order: 1,
      value: 'management-contact-info',
      responses: [
        {
          type: 'image',
          caption: 'Welcome to the future!',
          link: 'https://www.kcbi.org/wp-content/uploads/2020/01/welcome-to-the-future.jpg',
        },
      ],
    },
    {
      id: 'building-info-menu-option-2',
      label: 'Concierge Contact Info',
      numericValue: 2,
      order: 2,
      value: 'concierge-contact-info',
      responses: [
        {
          type: 'image',
          caption: 'Concierge welcome message!',
          link: 'https://sanecovision.com/wp-content/uploads/2017/02/Concierge-1600x900-1024x576.jpg',
        },
      ],
    },
    {
      id: 'building-info-menu-option-3',
      label: 'Back',
      numericValue: 3,
      order: 3,
      value: 'back',
      gotoStepId: 'main-menu-step-1',
    },
  ],
};

export const buildingInfoIntent: ChatBotIntent = {
  id: 'building-info-intent-id',
  botId: 'bot-id',
  title: 'building-info',
  type: 'intent',
  starterStepId: 'building-info-menu-1',
  handlerModule: 'simpleIntentHandler',
  whenCompleteGotoStepId: 'building-info-menu-1',

  steps: [buildingInfoStep1],
};
