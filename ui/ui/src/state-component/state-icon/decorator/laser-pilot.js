function decorate(state) {
  const decoratedState = state;

  decoratedState.laserPilot.icon = {
    on: 'flare',
    onColor: 'dark-red',
    off: 'radio-button-unchecked',
    offColor: 'silver',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};