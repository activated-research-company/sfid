function decorate(systemState) {
  const decoratedSystemState = systemState;

  decoratedSystemState.air.defaultSetpoint = 350;
  decoratedSystemState.hydrogen.defaultSetpoint = 50;
  decoratedSystemState.fidTemperature.defaultSetpoint = 400;
  decoratedSystemState.fid.defaultSetpoint = 4;

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
