function getNewPhidgetFactory({ TemperatureSensor, DigitalOutput }, phidgetDecorator) {
  function getNewPhidget(PhidgetType, id, channel, hubOptions) {
    const newPhidget = new PhidgetType();
    newPhidget.setChannel(channel);
    if (hubOptions) {
      newPhidget.setDeviceLabel(hubOptions.label);
      newPhidget.setHubPort(hubOptions.port);
      newPhidget.setIsHubPortDevice(hubOptions.isPort);
    }
    phidgetDecorator.decorate(newPhidget, id);
    return newPhidget;
  }

  function getHubOptions(label, port, isPort) {
    return {
      label,
      port,
      isPort,
    };
  }

  function getNewTemperatureSensor(hub, port, id) {
    return getNewPhidget(TemperatureSensor, id, 0, getHubOptions(hub, port, false));
  }

  function getNewDigitalOutput(hub, port, isHubPort, channel, id) {
    return getNewPhidget(DigitalOutput, id, channel, getHubOptions(hub, port, isHubPort));
  }

  return {
    getNewTemperatureSensor,
    getNewDigitalOutput,
  };
}

module.exports = (container) => {
  container.service(
    'phidgetFactory',
    getNewPhidgetFactory,
    'phidget',
    'phidgetDecorator',
  );
};
