function standbyStageOne(eventEmitter) {
  let diversionValveIsDiverting = false;

  function start() {
    if (!diversionValveIsDiverting) {
      eventEmitter.emit('setdiversionvalve', '0');
    }
  }

  function onDiversionValve(args) { diversionValveIsDiverting = args; }

  return {
    mode: 'standby',
    stages: 5,
    stage: 1,
    first: true,
    listeners: [
      { event: 'diversionvalve', handler: onDiversionValve },
    ],
    start,
    steps: [
      {
        description: 'Bypassing liquid flow',
        applies: () => !diversionValveIsDiverting,
        isComplete: () => diversionValveIsDiverting,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('standbyStageOne', standbyStageOne, 'eventEmitter');
};
