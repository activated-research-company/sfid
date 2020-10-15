function getNewPhidgetFactory(
  {
    Stepper,
    TemperatureSensor,
    DigitalOutput,
    Encoder,
    VoltageInput,
  },
  phidgetDecorator,
  env,
) {
  function getNewPhidget(PhidgetType, id, channel, hubOptions) {
    const newPhidget = new PhidgetType();
    newPhidget.setChannel(channel);
    if (hubOptions) {
      newPhidget.setDeviceLabel(hubOptions.label);
      newPhidget.setHubPort(hubOptions.port);
      newPhidget.setIsHubPortDevice(hubOptions.isPort);
    }

    if (env.phidget.useSim) {
      phidgetDecorator.decorate(newPhidget, id);
    } else {
      // TODO: this seems really dumb, but due to how the temperature-sensor-factory works
      // we need to delay the decoration otherwise errors are reported realy and don't allow
      // for proper closing of phidget channels
      setTimeout(() => {
        phidgetDecorator.decorate(newPhidget, id);
      }, 5000);
    }

    return newPhidget;
  }

  function getHubOptions(label, port, isPort) {
    return {
      label,
      port,
      isPort,
    };
  }

  function getNewStepper() {
    return getNewPhidget(Stepper, 'stepper', 0, null);
  }

  function getNewTemperatureSensor(hubLabel, hubPort, id) {
    return getNewPhidget(TemperatureSensor, id, 0, getHubOptions(hubLabel, hubPort, false));
  }

  function getNewDigitalOutput(hubLabel, hubPort, hubDevice, channel, id) {
    return getNewPhidget(DigitalOutput, id, channel, getHubOptions(hubLabel, hubPort, hubDevice));
  }

  function getNewEncoder() {
    return getNewPhidget(Encoder, 'encoder', null, null);
  }

  function getNewVoltageInput(hubLabel, hubPort, id) {
    return getNewPhidget(VoltageInput, id, 0, getHubOptions(hubLabel, hubPort, true));
  }

  return {
    getNewStepper,
    getNewTemperatureSensor,
    getNewDigitalOutput,
    getNewEncoder,
    getNewVoltageInput,
  };
}

module.exports = (container) => {
  container.service(
    'phidgetFactory',
    getNewPhidgetFactory,
    'phidget',
    'phidgetDecorator',
    'env',
  );
};
