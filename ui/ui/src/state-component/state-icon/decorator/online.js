function decorate(state) {
  const decoratedState = state;

  decoratedState.online.icon = {
    on: 'public',
    onColor: 'green',
    off: 'public',
    offColor: 'gray',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
