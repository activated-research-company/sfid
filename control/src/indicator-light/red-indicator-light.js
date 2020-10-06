function redIndicatorLight(indicatorLightFactory, { light: { red }}, eventEmitter) {
  const indicatorLight = indicatorLightFactory.getNewIndicatorLight(
    red.hub,
    red.port,
    'red',
  );

  const errorEvents = [
    'thermalrunaway',
    'unresponsivethermometer',
  ];

  function listenToErrorEvents() {
    errorEvents.forEach((errorEvent) => {
      eventEmitter.on(errorEvent, indicatorLight.on);
    });
  }

  function listen() {
    indicatorLight
      .connect()
      .then(() => {
        eventEmitter
          .on('components.complete', indicatorLight.off)
          .on('clearerror', indicatorLight.off);
        listenToErrorEvents();
        indicatorLight.on();
      });
  }

  return {
    listen,
  };
}

module.exports = (container) => {
  container.service(
    'redIndicatorLight',
    redIndicatorLight,
    'indicatorLightFactory',
    'env',
    'eventEmitter',
  );
};
