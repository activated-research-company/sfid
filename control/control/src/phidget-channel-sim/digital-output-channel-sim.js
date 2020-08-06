function digitalOutputChannelSim(eventEmitter) {
  function decorate(phidget, id) {
    const decoratedPhidget = phidget;

    function setDutyCycle(dutyCycle) {
      return new Promise((resolve) => {
        decoratedPhidget.dutyCycle = dutyCycle;
        eventEmitter.emit(`${id}dutycycle`, dutyCycle);
        resolve();
      });
    }

    function getDutyCycle() {
      return decoratedPhidget.dutyCycle;
    }
    decoratedPhidget.setDutyCycle = setDutyCycle;
    decoratedPhidget.getDutyCycle = getDutyCycle;

    decoratedPhidget.setDutyCycle(0);
  }

  return {
    decorate,
  };
}

module.exports = (container) => {
  container.service(
    'digitalOutputChannelSim',
    digitalOutputChannelSim,
    'eventEmitter',
  );
};
