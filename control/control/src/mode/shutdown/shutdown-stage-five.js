function shutdownStageFive(eventEmitter, reachedSetpoint) {
  let cellAirReachedSetpoint = false;
  let fidHydrogenReachedSetpoint = false;

  function start() {
    eventEmitter
      .emit('setcellair', 0)
      .emit('setfidhydrogen', 0)
      .emit('setfidtemperature', 0);
  }

  function onCellAir(args) { cellAirReachedSetpoint = reachedSetpoint(args, 0); }
  function onFidHydrogen(args) { fidHydrogenReachedSetpoint = reachedSetpoint(args, 0); }

  return {
    mode: 'shutdown',
    stage: 5,
    listeners: [
      { event: 'cellair', handler: onCellAir },
      { event: 'fidhydrogen', handler: onFidHydrogen },
    ],
    start,
    steps: [
      {
        description: 'Cutting cell air',
        isComplete: () => cellAirReachedSetpoint,
      },
      {
        description: `Cutting FID H${String.fromCharCode(0x2082)}`,
        isComplete: () => fidHydrogenReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('shutdownStageFive', shutdownStageFive, 'eventEmitter', 'reachedSetpoint');
};
