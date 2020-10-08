function shutdownStageFour(eventEmitter, reachedSetpoint) {
  let hydrogen = 0;
  const hydrogenSetpoint = 10;
  let hydrogenReachedSetpoint = false;
  let airReachedSetpoint = false;
  const fidTemperatureSetpoint = 50;
  let fidTemperature = 0;

  function start() {
    if (hydrogen > 10) { eventEmitter.emit('sethydrogen', hydrogenSetpoint); }
    if (fidTemperature > 50) { eventEmitter.emit('setfidtemperature', fidTemperatureSetpoint); }
    eventEmitter.emit('setair', 0)
  }

  function onHydrogen(args) {
    hydrogen = args.actual;
    hydrogenReachedSetpoint = reachedSetpoint(args, 0) || reachedSetpoint(args, hydrogenSetpoint);
  }

  function onAir(args) { airReachedSetpoint = reachedSetpoint(args, 0); }
  function onFidTemperature(args) { fidTemperature = args.actual; }

  return {
    mode: 'shutdown',
    stages: 3,
    stage: 1,
    first: true,
    listeners: [
      { event: 'hydrogen', handler: onHydrogen },
      { event: 'air', handler: onAir },
      { event: 'fidtemperature', handler: onFidTemperature },
    ],
    start,
    steps: [
      {
        description: `Cutting H${String.fromCharCode(0x2082)} to ${hydrogenSetpoint} SCCM`,
        applies: () => hydrogen > hydrogenSetpoint,
        isComplete: () => hydrogenReachedSetpoint,
      },
      {
        description: 'Cutting air',
        isComplete: () => airReachedSetpoint,
      },
      {
        description: `Cooling to ${fidTemperatureSetpoint} ${String.fromCharCode(176)}C`,
        applies: () => fidTemperature > fidTemperatureSetpoint,
        isComplete: () => fidTemperature <= fidTemperatureSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('shutdownStageFour', shutdownStageFour, 'eventEmitter', 'reachedSetpoint');
};
