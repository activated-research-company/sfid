function decorate(state) {
  const decoratedState = state;

  decoratedState.fidFlame.icon = {
    on: 'whatshot',
    onColor: 'dark-red',
    off: 'whatshot',
    offColor: 'gray',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
