function shutdownStageFive(eventEmitter, reachedSetpoint) {
  let hydrogenReachedSetpoint = false;

  function start() {
    eventEmitter
      .emit('sethydrogen', 0)
      .emit('setfidtemperature', 0);
  }

  function onHydrogen(args) { hydrogenReachedSetpoint = reachedSetpoint(args, 0); }

  return {
    mode: 'shutdown',
    stage: 2,
    listeners: [
      { event: 'hydrogen', handler: onHydrogen },
    ],
    start,
    steps: [
      {
        description: `Cutting H${String.fromCharCode(0x2082)}`,
        isComplete: () => hydrogenReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('shutdownStageFive', shutdownStageFive, 'eventEmitter', 'reachedSetpoint');
};
