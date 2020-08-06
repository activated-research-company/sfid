function shutdownStageThree(eventEmitter) {
  let diskRpm = 0;
  let laserPower = 0;

  function start() {
    if (diskRpm > 0) { eventEmitter.emit('setdiskrpm', 0); }
    if (laserPower > 0) { eventEmitter.emit('setlaserpower', 0); }
  }

  function onDiskRpm(args) { diskRpm = args.actual; }
  function onLaserPower(args) { laserPower = args.actual; }

  return {
    mode: 'shutdown',
    stage: 3,
    listeners: [
      { event: 'diskrpm', handler: onDiskRpm },
      { event: 'laserpower', handler: onLaserPower },
      { event: 'laser', handler: onLaserPower },
    ],
    start,
    steps: [
      {
        description: 'Shutting the laser off',
        applies: () => laserPower > 0,
        isComplete: () => laserPower === 0,
      },
      {
        description: 'Ramping down the disc',
        applies: () => diskRpm > 0,
        isComplete: () => diskRpm === 0,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('shutdownStageThree', shutdownStageThree, 'eventEmitter');
};
