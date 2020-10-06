function redIndicatorLight(indicatorLightFactory, { light: { orange }}, eventEmitter) {
  const indicatorLight = indicatorLightFactory.getNewIndicatorLight(
    orange.hub,
    orange.port,
    'orange',
  );

  function onMode(mode) {
    if (mode.inProcess === 'components' || mode.inProcess === 'ready') { return; }
    if (mode.current === 'analyze') {
      if (indicatorLight.isOn()) { indicatorLight.off(); }
    } else if (!indicatorLight.isOn()) { indicatorLight.on(); }
  }

  function listen() {
    indicatorLight
      .connect()
      .then(() => {
        eventEmitter
          .on('components.complete', indicatorLight.flash)
          .on('ready.complete', indicatorLight.on)
          .on('mode', onMode);
        indicatorLight.on();
      });
  }

  return {
    listen,
  };
}

module.exports = (container) => {
  container.service(
    'orangeIndicatorLight',
    redIndicatorLight,
    'indicatorLightFactory',
    'env',
    'eventEmitter',
  );
};