function analyzeStageFour() {
  // TODO: combine this with standby stage two (same exact logic)
  let diskRpm = 0;
  let discIsClean = false;
  let cleanDiscTimeout;

  // TODO: we shouldn't have to do this calculation in every single stage
  function getMillisecondsInTwoRotations() {
    return (1 / diskRpm) * 60 * 1000 * 2; // rpm * seconds * to milliseconds * two rotations
  }

  function start() {
    discIsClean = false;
    cleanDiscTimeout = setTimeout(() => {
      discIsClean = true;
    }, getMillisecondsInTwoRotations());
  }

  function stop() { clearTimeout(cleanDiscTimeout); }

  function onDiskRpm(args) { diskRpm = args.actual; }

  return {
    mode: 'analyze',
    stage: 4,
    listeners: [
      { event: 'diskrpm', handler: onDiskRpm },
    ],
    start,
    stop,
    steps: [
      {
        description: 'Cleaning the disc',
        isComplete: () => discIsClean,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('analyzeStageFour', analyzeStageFour);
};
