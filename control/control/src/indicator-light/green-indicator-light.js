function redIndicatorLight(indicatorLightFactory, { light: { green }}, eventEmitter) {
  const indicatorLight = indicatorLightFactory.getNewIndicatorLight(
    green.hub,
    green.port,
    'green',
  );

  let mode = {};

  function checkState() {
    if (mode.inProcess === 'components') { return; }
    if (mode.current !== 'analyze') {
      if (indicatorLight.isOn()) { indicatorLight.off(); }
    } else {
      indicatorLight.on();
    }
  }

  function onMode(args) {
    mode = args;
    checkState();
  }

  function listen() {
    indicatorLight
      .connect()
      .then(() => {
        eventEmitter.on('mode', onMode);
        indicatorLight.on();
      });
  }

  return {
    listen,
  };
}

module.exports = (container) => {
  container.service(
    'greenIndicatorLight',
    redIndicatorLight,
    'indicatorLightFactory',
    'env',
    'eventEmitter',
  );
};
