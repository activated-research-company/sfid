function decorate(state) {
  const decoratedState = state;

  decoratedState.greenLight.icon = {
    on: 'lens',
    onColor: 'green',
    off: 'lens',
    offColor: 'black',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
