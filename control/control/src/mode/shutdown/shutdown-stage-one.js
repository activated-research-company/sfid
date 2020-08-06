function shutdownStageOne(eventEmitter) {
  let diversionValveIsDiverting = false;

  function start() {
    eventEmitter.emit('setdiversionvalve', '0');
  }

  function onDiversionValve(args) {
    diversionValveIsDiverting = args;
  }

  return {
    mode: 'shutdown',
    stages: 6,
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
  container.service('shutdownStageOne', shutdownStageOne, 'eventEmitter');
};
