function standbyStageFour(eventEmitter, reachedSetpoint) {
  const standbyCellAirSetpoint = 20;
  let cellAirReachedSetpoint = false;
  const standbyCellPressure = 1;
  let cellPressureReachedSetpoint = false;
  let cellTemperatureReachedSetpoint = false;

  function start(setpoints) {
    eventEmitter
      .emit('setcellair', standbyCellAirSetpoint)
      .emit('setcelltemperature', setpoints.cellTemperature)
      .emit('setcellpressure', 1)
      .emit('setlasersoftinterlock', '1')
      .emit('fid.start', setpoints);
  }

  function onCellAir(args) {
    cellAirReachedSetpoint = reachedSetpoint(args, standbyCellAirSetpoint);
  }

  function onCellPressure(args) {
    cellPressureReachedSetpoint = reachedSetpoint(args, standbyCellPressure);
  }

  function onCellTemperature(args, setpoints) {
    cellTemperatureReachedSetpoint = reachedSetpoint(args, setpoints.cellTemperature);
  }

  return {
    mode: 'standby',
    stage: 4,
    listeners: [
      { event: 'cellair', handler: onCellAir },
      { event: 'cellpressure', handler: onCellPressure },
      { event: 'celltemperature', handler: onCellTemperature },
    ],
    start,
    steps: [
      {
        description: 'Flowing 20 SCCM air to the cell',
        isComplete: () => cellAirReachedSetpoint,
      },
      {
        description: 'Pressurizing the cell to 1 PSIG',
        isComplete: () => cellPressureReachedSetpoint,
      },
      {
        description: 'Heating the cell...',
        isComplete: () => cellTemperatureReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('standbyStageFour', standbyStageFour, 'eventEmitter', 'reachedSetpoint');
};
