function decorate(state) {
  const decoratedState = state;

  decoratedState.laserInterlock2.icon = {
    on: 'lock',
    off: 'lock-open',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
