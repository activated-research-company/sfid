function decorate(systemState) {
  const decoratedSystemState = systemState;

  decoratedSystemState.getSetpoints = () => {
    const setpoints = {};
    Object.keys(decoratedSystemState).forEach((state) => {
      if (decoratedSystemState[state] && Object.prototype.hasOwnProperty.call(decoratedSystemState[state], 'setpoint')) {
        if (decoratedSystemState[state].event === 'laserpower') {
          setpoints[state] = Math.round((decoratedSystemState[state].setpoint / 100) * process.env.LASER_MAX_POWER);
        } else {
          setpoints[state] = decoratedSystemState[state].setpoint;
        }
      }
    });
    return setpoints;
  };

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
