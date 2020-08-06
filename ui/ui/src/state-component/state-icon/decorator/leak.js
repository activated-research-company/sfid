function decorate(state) {
  const decoratedState = state;

  decoratedState.cellCompartmentLeak.icon = {
    on: 'warning',
    onColor: 'dark-red',
    off: 'warning',
    offColor: 'silver',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
