function fidStageOne(eventEmitter, reachedSetpoint) {
  let ignited = false;
  const airSetpoint = 0;
  let airReachedSetpoint = false;
  const hydrogenSetpoint = 10;
  let hydrogenReachedSetpoint = false;
  const tempSetpoint = 350;
  let tempReachedSetpoint = false;

  function start() {
    if (!ignited) {
      eventEmitter
        .emit('setfidair', airSetpoint)
        .emit('setfidhydrogen', hydrogenSetpoint)
        .emit('setfidtemperature', tempSetpoint);
    }
  }

  function onIgnited(args) { ignited = args; }
  function onAir(args) { airReachedSetpoint = reachedSetpoint(args, airSetpoint); }
  function onHydrogen(args) { hydrogenReachedSetpoint = reachedSetpoint(args, hydrogenSetpoint); }
  function onTemp(args) { tempReachedSetpoint = reachedSetpoint(args, tempSetpoint); }

  return {
    mode: 'fid',
    stages: 5,
    stage: 1,
    first: true,
    listeners: [
      { event: 'fidignited', handler: onIgnited },
      { event: 'fidair', handler: onAir },
      { event: 'fidhydrogen', handler: onHydrogen },
      { event: 'fidtemperature', handler: onTemp },
    ],
    start,
    steps: [
      {
        description: 'Cutting FID air',
        applies: () => !ignited,
        isComplete: () => airReachedSetpoint,
      },
      {
        description: `Flowing 10 SCCM H${String.fromCharCode(0x2082)} to the FID`,
        applies: () => !ignited,
        isComplete: () => hydrogenReachedSetpoint,
      },
      {
        description: `Heating the FID to ${tempSetpoint} ${String.fromCharCode(176)}C`,
        applies: () => !ignited,
        isComplete: () => tempReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('fidStageOne', fidStageOne, 'eventEmitter', 'reachedSetpoint');
};
