function decorate(state) {
  const decoratedState = state;

  decoratedState.online.icon = {
    on: 'cloud',
    onColor: 'green',
    off: 'cloud-off',
    offColor: 'gray',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
