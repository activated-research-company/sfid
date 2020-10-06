function channelSimService(
  digitalOutputChannelSim,
  stepperChannelSim,
  temperatureSensorChannelSim,
  encoderChannelSim,
  voltageInputChannelSim,
) {
  function getDecorator(channelName) {
    switch (channelName.toLowerCase()) {
      case 'digitaloutput':
        return digitalOutputChannelSim;
      case 'stepper':
        return stepperChannelSim;
      case 'temperaturesensor':
        return temperatureSensorChannelSim;
      case 'encoder':
        return encoderChannelSim;
      case 'voltageinput':
        return voltageInputChannelSim;
      default:
        return null;
    }
  }

  return {
    getDecorator,
  };
}

module.exports = (container) => {
  container.service(
    'channelSimService',
    channelSimService,
    'digitalOutputChannelSim',
    'stepperChannelSim',
    'temperatureSensorChannelSim',
    'encoderChannelSim',
    'voltageInputChannelSim',
  );
};
