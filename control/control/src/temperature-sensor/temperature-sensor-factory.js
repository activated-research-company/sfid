function getTemperatureSensorFactory(phidget, phidgetFactory, logger) {
  function getNewTemperatureSensor(hub, port, id) {
    const temperatureSensor = phidgetFactory.getNewTemperatureSensor(hub, port, id);
    let connected = false;

    temperatureSensor.onDetach = () => {
      connected = false;
      logger.error(`${id} temperature sensor detached`);
    };

    return {
      connect: () => temperatureSensor
        .open()
        .then((channel) => {
          channel.setRTDWireSetup(phidget.RTDWireSetup.WIRES_2);
          channel.setRTDType(phidget.RTDType.PT100_3850);
          return new Promise((resolve) => {
            setTimeout(() => {
            // TODO: figure out a much better way to handle this issue
            // what happens is the temperature sensor is immediately saturated when getTemperature()
            // because the RTD wire/type isn't set bofore the channel is opened
            // now I'm wondering if we can just set the RTD wire/type first
              connected = true;
              resolve();
            }, 5000);
          });
        }),
      getTemperature: () => (connected ? temperatureSensor.getTemperature() : 0),
      onData: (listener) => {
        temperatureSensor.onTemperatureChange = listener;
      },
    };
  }

  return {
    getNewTemperatureSensor,
  };
}

module.exports = (container) => {
  container.service(
    'temperatureSensorFactory',
    getTemperatureSensorFactory,
    'phidget',
    'phidgetFactory',
    'logger',
  );
};
