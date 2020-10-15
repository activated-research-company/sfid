function getTemperatureSensorFactory(phidget, phidgetFactory, logger) {
  function getNewTemperatureSensor(hubLabel, hubPort, identifier) {
    const temperatureSensor = phidgetFactory.getNewTemperatureSensor(hubLabel, hubPort, identifier);
    let connected = false;

    temperatureSensor.onAttach = (channel) => {
      channel.setRTDWireSetup(phidget.RTDWireSetup.WIRES_2);
      channel.setRTDType(phidget.RTDType.PT100_3850);
      setTimeout(() => {
        connected = true;
      }, 5000);
    };

    temperatureSensor.onDetach = () => {
      connected = false;
      logger.error(`${identifier} temperature sensor detached`);
    };

    return {
      connect: () => temperatureSensor
        .open()
        .then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
            // TODO: figure out a much better way to handle this issue
            // what happens is the temperature sensor is immediately saturated when getTemperature()
            // because the RTD wire/type isn't set bofore the channel is opened
            // now I'm wondering if we can just set the RTD wire/type first somehow
            // i've tried doing it but it just never works, you always get saturation
              connected = true;
              resolve();
            }, 5000);
          });
        }),
      getTemperature: () => {
        if (connected) {
          try {
            return temperatureSensor.getTemperature();
          } catch (e) {
            return 0;
          }
        }
        return 0;
      },
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
