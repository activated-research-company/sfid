function shutdownStageFive(eventEmitter, reachedSetpoint) {
  let fidHydrogenReachedSetpoint = false;

  function start() {
    eventEmitter
      .emit('setfidhydrogen', 0)
      .emit('setfidtemperature', 0);
  }

  function onFidHydrogen(args) { fidHydrogenReachedSetpoint = reachedSetpoint(args, 0); }

  return {
    mode: 'shutdown',
    stage: 2,
    listeners: [
      { event: 'fidhydrogen', handler: onFidHydrogen },
    ],
    start,
    steps: [
      {
        description: `Cutting H${String.fromCharCode(0x2082)}`,
        isComplete: () => fidHydrogenReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('shutdownStageFive', shutdownStageFive, 'eventEmitter', 'reachedSetpoint');
};
