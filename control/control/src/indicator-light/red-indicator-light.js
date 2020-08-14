function redIndicatorLight(indicatorLightFactory, { light: { red }}, eventEmitter) {
  const indicatorLight = indicatorLightFactory.getNewIndicatorLight(
    red.hub,
    red.port,
    'red',
  );

  const errorEvents = [
    'cellcompartment.leak',
    'stall',
    'thermalrunaway',
    'unresponsivethermometer',
  ];

  function listenToErrorEvents() {
    errorEvents.forEach((errorEvent) => {
      eventEmitter.on(errorEvent, (args) => {
        if (errorEvent !== 'cellcompartment.leak' || args) {
          indicatorLight.on();
        }
      });
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