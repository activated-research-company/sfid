function fidStageComplete(reachedSetpoint) {
  let ignited = false;
  let airReachedSetpoint = false;
  let hydrogenReachedSetpoint = false;
  let tempReachedSetpoint = false;

  function isComplete() {
    return (
      ignited
      && airReachedSetpoint
      && hydrogenReachedSetpoint
      && tempReachedSetpoint
    );
  }

  function onFid(args) { ignited = args.ignited; }
  function onAir(args, setpoints) { airReachedSetpoint = reachedSetpoint(args, setpoints.fidAir); }
  function onHydrogen(args, setpoints) { hydrogenReachedSetpoint = reachedSetpoint(args, setpoints.fidHydrogen); }
  function onTemperature(args, setpoints) { tempReachedSetpoint = reachedSetpoint(args, setpoints.fidTemperature); }

  return {
    mode: 'analyze',
    stage: 5,
    last: true,
    listeners: [
      { event: 'fid', handler: onFid },
      { event: 'fidair', handler: onAir },
      { event: 'fidhydrogen', handler: onHydrogen },
      { event: 'fidtemperature', handler: onTemperature },
    ],
    isComplete,
  };
}

module.exports = (container) => {
  container.service('fidStageComplete', fidStageComplete, 'reachedSetpoint');
};
