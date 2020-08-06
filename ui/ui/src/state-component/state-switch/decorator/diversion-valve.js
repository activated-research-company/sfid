function decorate(state) {
  const decoratedState = state;

  decoratedState.diversionValve.switch = {
    on: 'Cell',
    off: 'Bypass',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
