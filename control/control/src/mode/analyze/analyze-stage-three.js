function analyzeStageThree(eventEmitter, reachedSetpoint) {
  let laserPowerReachedSetpoint = false;

  function start(setpoints) { eventEmitter.emit('setlaserpower', setpoints.laserOutput); }

  function onLaser(args, setpoints) {
    laserPowerReachedSetpoint = reachedSetpoint(args, setpoints.laserOutput);
  }

  return {
    mode: 'analyze',
    stage: 3,
    listeners: [
      { event: 'laser', handler: onLaser },
    ],
    start,
    steps: [
      {
        description: 'Ramping laser power',
        isComplete: () => laserPowerReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('analyzeStageThree', analyzeStageThree, 'eventEmitter', 'reachedSetpoint');
};
