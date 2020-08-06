function stateSetpointLabels(m) {
  function component() {
    return {
      view: ({ attrs: { state } }) => m(
        `x-label.monospace${state.setpoint === state.defaultSetpoint ? '' : '.b.i'}`,
        `SP ${state.setpoint < 1 && state.setpoint > 0 ? state.setpoint.toFixed(2) : state.setpoint}`,
      ),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('stateSetpointLabels', stateSetpointLabels, 'm');
};
