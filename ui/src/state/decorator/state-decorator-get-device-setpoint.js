function decorate(systemState) {
  const decoratedSystemState = systemState;

  function addGetDeviceSetpointMethod(state) {
    const decoratedState = state;
    decoratedState.getDeviceSetpoint = () => decoratedState.deviceSetpoint;
  }

  function addGetDeviceSetpointMethods() {
    Object.keys(decoratedSystemState).forEach((state) => {
      if (Object.hasOwnProperty.call(decoratedSystemState[state], 'deviceSetpoint')) { addGetDeviceSetpointMethod(decoratedSystemState[state]); }
    });
  }

  addGetDeviceSetpointMethods(decoratedSystemState);

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
