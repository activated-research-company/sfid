function decorate(systemState) {
  const decoratedSystemState = systemState;

  decoratedSystemState.getSetpoints = () => {
    const setpoints = {};
    Object.keys(decoratedSystemState).forEach((state) => {
      if (decoratedSystemState[state] && Object.prototype.hasOwnProperty.call(decoratedSystemState[state], 'setpoint')) {
        setpoints[state] = decoratedSystemState[state].setpoint;
      }
    });
    return setpoints;
  };

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
