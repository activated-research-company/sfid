function decorate(systemState) {
  const decoratedSystemState = systemState;

  function addGetActualMethod(state) {
    const decoratedState = state;
    decoratedState.getActual = () => decoratedState.actual;
  }

  function addGetActualMethods() {
    Object.keys(decoratedSystemState).forEach((state) => {
      if (decoratedSystemState[state].event) { addGetActualMethod(decoratedSystemState[state]); }
    });
  }

  addGetActualMethods(decoratedSystemState);

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
