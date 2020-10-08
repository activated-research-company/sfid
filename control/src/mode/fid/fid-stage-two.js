function fidStageTwo(eventEmitter, reachedSetpoint) {
  let ignited = false;
  const airSetpoint = 200;
  let airReachedSetpoint = false;
  const hydrogenSetpoint = 50;
  let hydrogenReachedSetpoint = false;

  function start(setpoints) {
    if (!ignited) {
      eventEmitter
        .emit('setair', airSetpoint)
        .emit('sethydrogen', hydrogenSetpoint)
        .emit('setfidtemperature', setpoints.fidTemperature);
    }
  }

  function onFid(args) { ignited = args.ignited; }
  function onAir(args) { airReachedSetpoint = reachedSetpoint(args, airSetpoint); }
  function onHydrogen(args) { hydrogenReachedSetpoint = reachedSetpoint(args, hydrogenSetpoint); }

  return {
    mode: 'analyze',
    stage: 2,
    listeners: [
      { event: 'fid', handler: onFid },
      { event: 'air', handler: onAir },
      { event: 'hydrogen', handler: onHydrogen },
    ],
    start,
    steps: [
      {
        description: 'Flowing ignition gasses',
        applies: () => !ignited,
        isComplete: () => airReachedSetpoint && hydrogenReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('fidStageTwo', fidStageTwo, 'eventEmitter', 'reachedSetpoint');
};
