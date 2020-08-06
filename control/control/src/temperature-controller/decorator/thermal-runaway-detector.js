function getDecorator(eventEmitter, logger) {
  function decorate(temperatureControllerFactory) {
    const decoratedTemperatureControllerFactory = temperatureControllerFactory;

    const shift = (arrays) => arrays.forEach((array) => array.shift());
    function hasEverDecreased(array) {
      return array.find((element, i) => {
        if (i === array.length - 1) { return null; }
        return element > array[i + 1];
      });
    }
    function hasChanged(array) {
      return array.find((element) => element !== array[0]);
    }
    const getMax = (array) => Math.max(...array);
    function isThermalRunaway(setpoint, actual, temps, outputs) {
      // TODO: add another check for above ambient temperature
      return actual > 50 && !hasEverDecreased(temps) && hasChanged(temps) && getMax(outputs) <= 0;
    }

    function monitorForThermalRunaway(identifier) {
      const monitorFrameSeconds = 20;
      let thermalRunaway = false;
      const temps = [];
      const outputs = [];

      eventEmitter.on(`set${identifier}temperature`, () => {
        temps.splice(0, temps.length);
        outputs.splice(0, outputs.length);
      });

      eventEmitter.on(`${identifier}temperature`, ({
        setpoint,
        actual,
        output,
        sampleRate,
      }) => {
        if (actual === 0) { return; }
        temps.push(actual);
        outputs.push(output);

        if (temps.length > monitorFrameSeconds * (1000 / sampleRate)) {
          shift([temps, outputs]);

          if (isThermalRunaway(setpoint, actual, temps, outputs)) {
            if (!thermalRunaway) {
              // TODO: logging should be done in a separate object
              thermalRunaway = true;
              logger.error(`thermal runaway detected in the ${identifier} ${actual}/${setpoint} [${temps.map((temp) => temp.toFixed(2))}]`);
            }
            eventEmitter.emit('thermalrunaway', identifier);
          } else {
            thermalRunaway = false;
          }
        }
      });
    }

    decoratedTemperatureControllerFactory.getNewTemperatureController = new Proxy(
      decoratedTemperatureControllerFactory.getNewTemperatureController,
      {
        apply: (target, thisArg, argumentsList) => {
          monitorForThermalRunaway(argumentsList[0]);
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
