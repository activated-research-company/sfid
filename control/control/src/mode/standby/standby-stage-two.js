function standbyStageTwo() {
  let diskRpm = 0;
  let laserPower = 0;
  let needToCleanDisc = false;
  let discIsClean = false;
  let cleanDiscTimeout;

  // TODO: we shouldn't have to do this calculation in every single stage
  function getMillisecondsInTwoRotations() {
    return (1 / diskRpm) * 60 * 1000 * 2; // rpm * seconds * to milliseconds * two rotations
  }

  function start() {
    if (needToCleanDisc) {
      cleanDiscTimeout = setTimeout(() => {
        discIsClean = true;
      }, getMillisecondsInTwoRotations());
    } else {
      discIsClean = true;
    }
  }

  function stop() { clearTimeout(cleanDiscTimeout); }

  function onDiskRpm(args) { diskRpm = args.actual; }
  function onLaser(args) {
    laserPower = args.actual;
    needToCleanDisc = laserPower > 0;
  }

  return {
    mode: 'standby',
    stage: 2,
    listeners: [
      { event: 'diskrpm', handler: onDiskRpm },
      { event: 'laser', handler: onLaser },
    ],
    start,
    stop,
    steps: [
      {
        description: 'Cleaning the disc',
        applies: () => needToCleanDisc,
        isComplete: () => discIsClean,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('standbyStageTwo', standbyStageTwo);
};
