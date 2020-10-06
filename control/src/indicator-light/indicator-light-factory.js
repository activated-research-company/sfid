function getNewIndicatorLightFactory(digitalOutputFactory, eventEmitter, logger) {
  function getNewIndicatorLight(hub, port, id) {
    let emitInterval;
    let flashInterval;
    const flashIntervalTime = 500;

    let digitalOutput;
    let indicatorLightIsOn = false; // tracking this locally alleviates heavy communication

    function emitState() {
      eventEmitter.emit(`${id}light`, indicatorLightIsOn);
    }

    function startEmitting() {
      if (!emitInterval) {
        emitInterval = setInterval(emitState, 1000);
      }
    }

    function stopEmitting() {
      if (emitInterval) {
        clearInterval(emitInterval);
        emitInterval = false;
      }
    }

    function connect() {
      digitalOutput = digitalOutputFactory.getNewDigitalOutput(hub, port, true, 0, id);
      startEmitting();
      return digitalOutput.connect();
    }

    function setOutput(output) {
      digitalOutput
        .setOutput(output)
        .then(() => {
          indicatorLightIsOn = output === 1;
          emitState();
        })
        .catch(logger.error);
    }

    function flipOutput() {
      if (indicatorLightIsOn) {
        setOutput(0);
      } else {
        setOutput(1);
      }
    }

    function startFlashing() {
      if (!flashInterval) {
        stopEmitting();
        flashInterval = setInterval(flipOutput, flashIntervalTime);
      }
    }

    function stopFlashing() {
      if (flashInterval) {
        clearInterval(flashInterval);
        flashInterval = false;
        startEmitting();
      }
    }

    function on() {
      stopFlashing();
      setOutput(1);
    }

    function off() {
      stopFlashing();
      setOutput(0);
    }

    function isOn() { return indicatorLightIsOn; }

    return {
      connect,
      on,
      off,
      flash: startFlashing,
      isOn,
    };
  }

  return {
    getNewIndicatorLight,
  };
}

module.exports = (container) => {
  container.service(
    'indicatorLightFactory',
    getNewIndicatorLightFactory,
    'digitalOutputFactory',
    'eventEmitter',
    'logger',
  );
};
