function decorate(state) {
  const decoratedState = state;

  decoratedState.diversionValve.icon = {
    on: 'waves',
    onColor: 'blue',
    off: 'waves',
    offColor: 'gray',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
