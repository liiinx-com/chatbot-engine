const hi = {
  type: 'text',
  id: '1',
  order: 1,
  text: 'hi {0}',
  key: 'if no option then NA',
  options: [],
  previousStepId: null,
  nextStepId: null,
};

const buildingInfo = {
  id: '2',
  order: 2,
  text: 'Building info',
  key: 'selectedItemId',
  options: [
    {
      id: 'buildingInfo*2*1',
      order: 1,
      label: 'Building Address',
      value: 'building_address',
      numericValue: '1',
    },
  ],
  previousStepId: null,
  nextStepId: null,
};

const menu = {
  hi,
  buildingInfo,
};

const chatBot = {
  title: '510 Curran Places',
  menu,
};
