function decorate(state) {
  const decoratedState = state;

  decoratedState.redLight.icon = {
    on: 'lens',
    onColor: 'dark-red',
    off: 'lens',
    offColor: 'black',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
