function shutdownStageFour(eventEmitter, reachedSetpoint) {
  let fidHydrogen = 0;
  const fidHydrogenSetpoint = 10;
  let fidHydrogenReachedSetpoint = false;
  let fidAirReachedSetpoint = false;
  const fidTemperatureSetpoint = 50;
  let fidTemperature = 0;
  const cellAirSetpoint = 20;
  let cellAir;
  let cellAirReachedSetpoint = false;
  const cellPressureSetpoint = 1;
  let cellPressureReachedSetpoint = false;

  function start() {
    // TODO: add a fid shutdown service
    if (fidHydrogen > 10) { eventEmitter.emit('setfidhydrogen', fidHydrogenSetpoint); }
    if (fidTemperature > 50) { eventEmitter.emit('setfidtemperature', fidTemperatureSetpoint); }
    if (cellAir > cellAirSetpoint) { eventEmitter.emit('setcellair', cellAirSetpoint); }
    eventEmitter
      .emit('setfidair', 0)
      .emit('setcellpressure', cellPressureSetpoint)
      .emit('setcelltemperature', 0);
  }

  function onFidHydrogen(args) {
    fidHydrogen = args.actual;
    fidHydrogenReachedSetpoint = reachedSetpoint(args, 0) || reachedSetpoint(args, fidHydrogenSetpoint);
  }

  function onFidAir(args) { fidAirReachedSetpoint = reachedSetpoint(args, 0); }
  function onFidTemperature(args) { fidTemperature = args.actual; }

  function onCellAir(args) {
    cellAir = args.actual;
    cellAirReachedSetpoint = reachedSetpoint(args, cellAirSetpoint);
  }

  function onCellPressure(args) {
    cellPressureReachedSetpoint = reachedSetpoint(args, cellPressureSetpoint);
  }

  return {
    mode: 'shutdown',
    stage: 4,
    listeners: [
      { event: 'fidhydrogen', handler: onFidHydrogen },
      { event: 'fidair', handler: onFidAir },
      { event: 'fidtemperature', handler: onFidTemperature },
      { event: 'cellair', handler: onCellAir },
      { event: 'cellpressure', handler: onCellPressure },
    ],
    start,
    steps: [
      {
        description: `Cutting FID H${String.fromCharCode(0x2082)} to ${fidHydrogenSetpoint} SCCM`,
        applies: () => fidHydrogen > fidHydrogenSetpoint,
        isComplete: () => fidHydrogenReachedSetpoint,
      },
      {
        description: 'Cutting FID air',
        isComplete: () => fidAirReachedSetpoint,
      },
      {
        description: `Flowing ${cellAirSetpoint} SCCM of air to the cell`,
        isComplete: () => cellAirReachedSetpoint,
        applies: () => cellAir > cellAirSetpoint,
      },
      {
        description: `Pressurizing the cell to ${cellPressureSetpoint} PSIG`,
        isComplete: () => cellPressureReachedSetpoint,
      },
      {
        description: `Cooling FID to ${fidTemperatureSetpoint} ${String.fromCharCode(176)}C`,
        applies: () => fidTemperature > fidTemperatureSetpoint,
        isComplete: () => fidTemperature <= fidTemperatureSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('shutdownStageFour', shutdownStageFour, 'eventEmitter', 'reachedSetpoint');
};
