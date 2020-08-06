function shutdownStageComplete(reachedSetpoint) {
  let fidHydrogenReachedSetpoint = false;

  const isComplete = () => fidHydrogenReachedSetpoint;

  function onFidHydrogen(args) {
    fidHydrogenReachedSetpoint = reachedSetpoint(args, 0);
  }

  return {
    mode: 'shutdown',
    stage: 6,
    last: true,
    listeners: [
      { event: 'fidhydrogen', handler: onFidHydrogen },
    ],
    isComplete,
  };
}

module.exports = (container) => {
  container.service('shutdownStageComplete', shutdownStageComplete, 'reachedSetpoint');
};
