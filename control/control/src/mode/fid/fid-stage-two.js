function fidStageTwo(eventEmitter, reachedSetpoint) {
  let ignited = false;
  const airSetpoint = 200;
  let airReachedSetpoint = false;
  const hydrogenSetpoint = 50;
  let hydrogenReachedSetpoint = false;

  function start(setpoints) {
    if (!ignited) {
      eventEmitter
        .emit('setfidair', airSetpoint)
        .emit('setfidhydrogen', hydrogenSetpoint)
        .emit('setfidtemperature', setpoints.fidTemperature);
    }
  }

  function onIgnited(args) { ignited = args; }
  function onAir(args) { airReachedSetpoint = reachedSetpoint(args, airSetpoint); }
  function onHydrogen(args) { hydrogenReachedSetpoint = reachedSetpoint(args, hydrogenSetpoint); }

  return {
    mode: 'fid',
    stage: 2,
    listeners: [
      { event: 'fidignited', handler: onIgnited },
      { event: 'fidair', handler: onAir },
      { event: 'fidhydrogen', handler: onHydrogen },
    ],
    start,
    steps: [
      {
        description: 'Flowing gasses to light the FID',
        applies: () => !ignited,
        isComplete: () => airReachedSetpoint && hydrogenReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('fidStageTwo', fidStageTwo, 'eventEmitter', 'reachedSetpoint');
};
