function shutdownStageComplete(reachedSetpoint) {
  let hydrogenReachedSetpoint = false;

  const isComplete = () => hydrogenReachedSetpoint;

  function onHydrogen(args) {
    hydrogenReachedSetpoint = reachedSetpoint(args, 0);
  }

  return {
    mode: 'shutdown',
    stage: 3,
    last: true,
    listeners: [
      { event: 'hydrogen', handler: onHydrogen },
    ],
    isComplete,
  };
}

module.exports = (container) => {
  container.service('shutdownStageComplete', shutdownStageComplete, 'reachedSetpoint');
};
