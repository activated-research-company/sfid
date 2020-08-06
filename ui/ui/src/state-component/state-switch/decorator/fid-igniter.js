function decorate(state) {
  const decoratedState = state;

  decoratedState.fidIgniter.switch = {
    on: 'Ignite',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
