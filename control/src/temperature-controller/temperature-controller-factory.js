function getTemperatureControllerFactory(
  pidControllerFactory,
  digitalOutputFactory,
  temperatureSensorFactory,
  state,
  eventEmitter,
  logger,
) {
  function getNewTemperatureController(
    identifier,
    temperatureSensorHub,
    temperatureSensorPort,
    digitalOutputHub,
    digitalOutputPort,
    digitalOutputChannel,
  ) {
    const pidController = pidControllerFactory.getNewPidController(identifier);
    let resetIntegrator = true;
    const temperatureSensor = temperatureSensorFactory.getNewTemperatureSensor(
      temperatureSensorHub,
      temperatureSensorPort,
      identifier,
    );
    const digitalOutput = digitalOutputFactory.getNewDigitalOutput(
      digitalOutputHub,
      digitalOutputPort,
      false,
      digitalOutputChannel,
      identifier,
    );

    function setTemperature(temperature) {
      pidController.reset();
      resetIntegrator = true;
      pidController.setTarget(temperature);
    }

    eventEmitter.on(`set${identifier}temperature`, setTemperature);

    function emit(temperature) {
      const payload = {
        setpoint: pidController.target,
        kp: pidController.k_p,
        ki: pidController.k_i,
        kd: pidController.k_d,
        output: digitalOutput.getOutput(),
        actual: temperature,
        sampleRate: 250,
      };

      state.next({ type: 'heater', payload });
      eventEmitter.emit(`${identifier}temperature`, payload);
    }

    function setOutput(output) {
      digitalOutput
        .setOutput(output)
        .catch(logger.error);
    }

    function update() {
      const temperature = temperatureSensor.getTemperature();
      emit(temperature);

      if (pidController.target) {
        if (resetIntegrator && (Math.abs(temperature - pidController.target) < 1)) {
          resetIntegrator = false;
          pidController.reset();
        }
        const output = pidController.update(temperature);
        const dutyCycle = Math.min(1, Math.max(output / 100, 0)).toFixed(6);
        setOutput(Math.max(dutyCycle, 0));
      } else {
        setOutput(0);
      }
    }

    temperatureSensor
      .connect()
      .then(digitalOutput.connect)
      .then(() => {
        setInterval(update, 250);
      });
  }

  return {
    getNewTemperatureController,
  };
}

module.exports = (container) => {
  container.service(
    'temperatureControllerFactory',
    getTemperatureControllerFactory,
    'pidControllerFactory',
    'digitalOutputFactory',
    'temperatureSensorFactory',
    'state',
    'eventEmitter',
    'logger',
  );
};
