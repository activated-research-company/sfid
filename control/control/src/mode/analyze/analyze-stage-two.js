function analyzeStageTwo(eventEmitter, reachedSetpoint) {
  let cellPressureReachedSetpoint = false;

  function start(setpoints) {
    eventEmitter
      .emit('setcellpressure', setpoints.cellPressure)
      .emit('setlasersoftinterlock', '0');
  }

  function onCellPressure(args, setpoints) {
    cellPressureReachedSetpoint = reachedSetpoint(args, setpoints.cellPressure);
  }

  return {
    mode: 'analyze',
    stage: 2,
    listeners: [
      { event: 'cellpressure', handler: onCellPressure },
    ],
    start,
    steps: [
      {
        description: 'Pressurizing the cell',
        isComplete: () => cellPressureReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('analyzeStageTwo', analyzeStageTwo, 'eventEmitter', 'reachedSetpoint');
};
