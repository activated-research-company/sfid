function redIndicatorLight(indicatorLightFactory, { light: { green }}, eventEmitter) {
  const indicatorLight = indicatorLightFactory.getNewIndicatorLight(
    green.hub,
    green.port,
    'green',
  );

  let diversionValveIsDiverting = true;
  let mode = {};

  function checkState() {
    if (mode.inProcess === 'components') { return; }
    if (mode.current !== 'analyze') {
      if (indicatorLight.isOn()) { indicatorLight.off(); }
    } else if (diversionValveIsDiverting) {
      indicatorLight.flash();
    } else {
      indicatorLight.on();
    }
  }

  function onMode(args) {
    mode = args;
    checkState();
  }

  function onDiversionValve(args) {
    diversionValveIsDiverting = args;
    checkState();
  }

  function listen() {
    indicatorLight
      .connect()
      .then(() => {
        eventEmitter
          .on('mode', onMode)
          .on('diversionvalve', onDiversionValve);
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
