function decorate(systemState) {
  const decoratedSystemState = systemState;

  function isConnected() {
    return this.lastUpdated && new Date() - this.lastUpdated < 5000;
  }

  function addIsConnectedMethod(state) {
    const decoratedState = state;
    decoratedState.isConnected = isConnected;
  }

  function addIsConnectedMethods() {
    Object.keys(decoratedSystemState).forEach((state) => {
      if (decoratedSystemState[state].event) { addIsConnectedMethod(decoratedSystemState[state], decoratedSystemState); }
    });
  }

  addIsConnectedMethods(decoratedSystemState);

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
