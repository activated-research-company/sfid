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
        .emit('setair', airSetpoint)
        .emit('sethydrogen', hydrogenSetpoint)
        .emit('setfidtemperature', tempSetpoint);
    }
  }

  function onFid(args) { ignited = args.ignited; }
  function onAir(args) { airReachedSetpoint = reachedSetpoint(args, airSetpoint); }
  function onHydrogen(args) { hydrogenReachedSetpoint = reachedSetpoint(args, hydrogenSetpoint); }
  function onTemp(args) { tempReachedSetpoint = reachedSetpoint(args, tempSetpoint); }

  return {
    mode: 'analyze',
    stages: 5,
    stage: 1,
    first: true,
    listeners: [
      { event: 'fid', handler: onFid },
      { event: 'air', handler: onAir },
      { event: 'hydrogen', handler: onHydrogen },
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
        description: `Flowing 10 SCCM H${String.fromCharCode(0x2082)}`,
        applies: () => !ignited,
        isComplete: () => hydrogenReachedSetpoint,
      },
      {
        description: `Heating to ${tempSetpoint} ${String.fromCharCode(176)}C`,
        applies: () => !ignited,
        isComplete: () => tempReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('fidStageOne', fidStageOne, 'eventEmitter', 'reachedSetpoint');
};
