function decorate(state) {
  const decoratedState = state;

  decoratedState.orangeLight.icon = {
    on: 'lens',
    onColor: 'orange',
    off: 'lens',
    offColor: 'black',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
