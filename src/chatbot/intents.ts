const intents = {
  hi: {
    firstStepId: 'hi.1',
    handlerModule: 'hi',
  },
  invitationCheck: {
    firstStepId: 'invitationCheck.1',
    handlerModule: 'invitationCheck',
  },
  mainMenu: {
    firstStepId: 'mainMenu.1',
    handlerModule: 'mainMenu',
  },
  newReturnOrder: {
    firstStepId: 'newReturnOrder.1',
    handlerModule: 'newReturnOrder',
  },
  curran: {
    firstStepId: 'curran.1',
    handlerModule: 'curran',
  },
};

export default {
  intents,
};

const chatbot = {
  id: 1,
  code: 'curran-150',
  title: '',
  description: '',
  mainStepCode: 'mainMenu.1',
  status: 'ACTIVE',
};
