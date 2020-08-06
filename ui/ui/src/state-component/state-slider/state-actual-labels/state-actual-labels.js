function stateActualLabels(m, throbber) {
  function component() {
    function getEmphasis(state) {
      if (Object.hasOwnProperty.call(state, 'setpoint')) {
        if (state.deviceSetpoint && !state.reachedSetpoint) {
          return 'dark-green.i';
        }
      }
      return 'black';
    }

    function getActualLabel(state) {
      return m(`x-label.lh-20.nowrap.${getEmphasis(state)}`, state.getDisplayValue());
    }

    function stateIsConnected(state) {
      return state.isConnected && state.isConnected();
    }

    function getActualLabels(state, hideSecondary) {
      const actuals = [];
      if (state.getDisplayValue) { actuals.push(getActualLabel(state)); }
      if (!hideSecondary && state.secondary) { actuals.push(getActualLabel(state.secondary)); }
      return stateIsConnected(state) ? m('.tr.monospace', actuals) : m(throbber);
    }

    return {
      view: ({ attrs }) => getActualLabels(attrs.state, attrs.hideSecondary),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('stateActualLabels', stateActualLabels, 'm', 'throbber');
};
