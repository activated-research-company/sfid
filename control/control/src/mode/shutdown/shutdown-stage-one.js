function shutdownStageFour(eventEmitter, reachedSetpoint) {
  let fidHydrogen = 0;
  const fidHydrogenSetpoint = 10;
  let fidHydrogenReachedSetpoint = false;
  let fidAirReachedSetpoint = false;
  const fidTemperatureSetpoint = 50;
  let fidTemperature = 0;

  function start() {
    if (fidHydrogen > 10) { eventEmitter.emit('setfidhydrogen', fidHydrogenSetpoint); }
    if (fidTemperature > 50) { eventEmitter.emit('setfidtemperature', fidTemperatureSetpoint); }
    eventEmitter.emit('setfidair', 0)
  }

  function onFidHydrogen(args) {
    fidHydrogen = args.actual;
    fidHydrogenReachedSetpoint = reachedSetpoint(args, 0) || reachedSetpoint(args, fidHydrogenSetpoint);
  }

  function onFidAir(args) { fidAirReachedSetpoint = reachedSetpoint(args, 0); }
  function onFidTemperature(args) { fidTemperature = args.actual; }

  return {
    mode: 'shutdown',
    stages: 3,
    stage: 1,
    first: true,
    listeners: [
      { event: 'fidhydrogen', handler: onFidHydrogen },
      { event: 'fidair', handler: onFidAir },
      { event: 'fidtemperature', handler: onFidTemperature },
    ],
    start,
    steps: [
      {
        description: `Cutting H${String.fromCharCode(0x2082)} to ${fidHydrogenSetpoint} SCCM`,
        applies: () => fidHydrogen > fidHydrogenSetpoint,
        isComplete: () => fidHydrogenReachedSetpoint,
      },
      {
        description: 'Cutting air',
        isComplete: () => fidAirReachedSetpoint,
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
