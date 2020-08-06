function decorate(state) {
  const decoratedState = state;

  decoratedState.laserHardInterlock.icon = {
    on: 'lock',
    off: 'lock-open',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
