function fidStageFour(eventEmitter, reachedSetpoint) {
  let ignited = false;
  let flameStabilizing = false;
  let ignitedForThreeSeconds = false;
  let airReachedSetpoint = false;
  let hydrogenReachedSetpoint = false;
  let tempReachedSetpoint = false;

  function start(setpoints) {
    ignitedForThreeSeconds = false;
    if (ignited && !flameStabilizing) {
      flameStabilizing = true;
      setTimeout(() => {
        ignitedForThreeSeconds = true;
        flameStabilizing = false;
        eventEmitter
          .emit('setfidair', setpoints.fidAir)
          .emit('setfidhydrogen', setpoints.fidHydrogen);
      }, 3000);
    }
  }

  function onIgnited(args) { ignited = args; }
  function onAir(args, setpoints) { airReachedSetpoint = reachedSetpoint(args, setpoints.fidAir); }
  function onHydrogen(args, setpoints) { hydrogenReachedSetpoint = reachedSetpoint(args, setpoints.fidHydrogen); }
  function onTemperature(args, setpoints) { tempReachedSetpoint = reachedSetpoint(args, setpoints.fidTemperature); }

  return {
    mode: 'fid',
    stage: 4,
    listeners: [
      { event: 'fidignited', handler: onIgnited },
      { event: 'fidair', handler: onAir },
      { event: 'fidhydrogen', handler: onHydrogen },
      { event: 'fidtemperature', handler: onTemperature },
    ],
    start,
    steps: [
      {
        description: 'Stabilizing the FID flame',
        isComplete: () => ignitedForThreeSeconds,
      },
      {
        description: 'Flowing final FID gasses',
        isComplete: () => airReachedSetpoint && hydrogenReachedSetpoint,
      },
      {
        description: 'Heating the FID',
        isComplete: () => tempReachedSetpoint,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('fidStageFour', fidStageFour, 'eventEmitter', 'reachedSetpoint');
};
