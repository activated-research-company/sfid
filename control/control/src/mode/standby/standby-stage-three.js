function standbyStageThree(eventEmitter) {
  let diskRpm = 0;
  let laserPower = 0;

  function start() {
    if (diskRpm > 0) { eventEmitter.emit('setdiskrpm', 0); }
    if (laserPower > 0) { eventEmitter.emit('setlaserpower', 0); }
  }

  const diskHasStoppedSpinning = () => diskRpm === 0;
  const laserIsOff = () => laserPower === 0;


  function onDiskRpm(args) { diskRpm = args.actual; }
  function onLaser(args) { laserPower = args.actual; }

  return {
    mode: 'standby',
    stage: 3,
    listeners: [
      { event: 'diskrpm', handler: onDiskRpm },
      { event: 'laser', handler: onLaser },
    ],
    start,
    steps: [
      {
        description: 'Turning off the laser',
        applies: () => laserPower,
        isComplete: laserIsOff,
      },
      {
        description: 'Stopping the disc',
        applies: () => diskRpm,
        isComplete: diskHasStoppedSpinning,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('standbyStageThree', standbyStageThree, 'eventEmitter');
};
