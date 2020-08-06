function decorate(systemState) {
  const decoratedSystemState = systemState;

  decoratedSystemState.cellAir.defaultSetpoint = 500;
  decoratedSystemState.cellTemperature.defaultSetpoint = 150;
  decoratedSystemState.cellDiskSpeed.defaultSetpoint = 1;
  decoratedSystemState.cellPressure.defaultSetpoint = 3;
  decoratedSystemState.laserOutput.defaultSetpoint = 67;
  decoratedSystemState.fidAir.defaultSetpoint = 350;
  decoratedSystemState.fidHydrogen.defaultSetpoint = 50;
  decoratedSystemState.fidTemperature.defaultSetpoint = 400;

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
