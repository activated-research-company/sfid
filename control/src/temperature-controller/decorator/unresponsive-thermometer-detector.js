function getDecorator(eventEmitter, logger) {
  function decorate(temperatureControllerFactory) {
    const decoratedTemperatureControllerFactory = temperatureControllerFactory;

    // TODO: we should decorate another object with most of this since it's almost 90% shared between detectors

    const shift = (arrays) => arrays.forEach((array) => array.shift());

    function isIncreasing(array, threshhold) {
      return array.find((element) => array[array.length - 1] - element >= threshhold);
    }

    const getMin = (array) => Math.min(...array);
    const thermometerIsUnresponsive = (temps, outputs) => !isIncreasing(temps, 0.01) && getMin(outputs) >= process.env.DUTY_CYCLE_LIMIT; // TODO: get this from env.js

    function monitorForUnresponsiveThermometer(identifier) {
      const monitorFrameSeconds = 15;
      let unresponsiveThemometer = false;
      const temps = [];
      const outputs = [];

      eventEmitter.on(`set${identifier}temperature`, () => {
        temps.splice(0, temps.length);
        outputs.splice(0, outputs.length);
      });

      eventEmitter.on(`${identifier}temperature`, ({ actual, output, sampleRate }) => {
        if (actual === 0) { return; }
        temps.push(actual);
        outputs.push(output);

        if (temps.length > monitorFrameSeconds * (1000 / sampleRate)) {
          shift([temps, outputs]);

          if (thermometerIsUnresponsive(temps, outputs)) {
            if (!unresponsiveThemometer) {
              // TODO: logging should be done in a separate object
              unresponsiveThemometer = true;
              logger.error(`unresponsive thermometer detected in the ${identifier} [${temps.map((temp) => temp.toFixed(2))}]`);
            }
            eventEmitter.emit(`set${identifier}temperature`, 0);
            eventEmitter.emit('unresponsivethermometer', identifier);
          } else {
            unresponsiveThemometer = false;
          }
        }
      });
    }

    decoratedTemperatureControllerFactory.getNewTemperatureController = new Proxy(
      decoratedTemperatureControllerFactory.getNewTemperatureController,
      {
        apply: (target, thisArg, argumentsList) => {
          monitorForUnresponsiveThermometer(argumentsList[0]);
          return target(...argumentsList);
        },
      },
    );

    return decoratedTemperatureControllerFactory;
  }

  return decorate;
}

module.exports = (container) => {
  container.decorator(
    'temperatureControllerFactory',
    getDecorator(
      container.container.eventEmitter,
      container.container.logger,
    ),
  );
};
