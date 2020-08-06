function temperatureSensorChannelSim(eventEmitter) {
  let onTemperatureChangeInterval;
  let setTemperatureInterval;
  const roomTemperature = 23;

  function decorate(phidget, identifier) {
    const decoratedPhidget = phidget;
    decoratedPhidget.onTemperatureChange = () => {};
    decoratedPhidget.temperature = roomTemperature;
    decoratedPhidget.dutyCycle = 0;
    decoratedPhidget.getTemperature = () => decoratedPhidget.temperature;
    onTemperatureChangeInterval = setInterval(() => decoratedPhidget.onTemperatureChange(decoratedPhidget.temperature), 500);
    setTemperatureInterval = setInterval(() => {
      const { temperature, dutyCycle } = decoratedPhidget;
      const newTemperature = temperature + (dutyCycle * 5) - (((temperature - roomTemperature) / temperature) / 2);
      decoratedPhidget.temperature = parseFloat(Math.max(roomTemperature, newTemperature).toFixed(2));
    }, 500);
    decoratedPhidget.detach = () => {
      clearInterval(onTemperatureChangeInterval);
      clearInterval(setTemperatureInterval);
      if (decoratedPhidget.onDetach) { decoratedPhidget.onDetach(); }
    };

    eventEmitter.on(`${identifier}dutycycle`, (dutyCycle) => {
      decoratedPhidget.dutyCycle = dutyCycle;
    });

    // setTimeout(() => { // use this for thermal runaway testing
    //   decoratedPhidget.dutyCycle = 0.01;
    // }, 5000);
  }

  return {
    decorate,
  };
}

module.exports = (container) => {
  container.service(
    'temperatureSensorChannelSim',
    temperatureSensorChannelSim,
    'eventEmitter',
  );
};
