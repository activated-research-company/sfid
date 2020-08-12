function decorate(systemState) {
  const decoratedSystemState = systemState;

  decoratedSystemState.fidAir.defaultSetpoint = 350;
  decoratedSystemState.fidHydrogen.defaultSetpoint = 50;
  decoratedSystemState.fidTemperature.defaultSetpoint = 400;

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
