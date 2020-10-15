function mockPhidgetDecorator(channelMockService) {
  function scheduleOnAttach(phidget) {
    setTimeout(() => {
      if (phidget.onAttach) { phidget.onAttach(phidget); }
    }, 500);
  }

  function decorate(phidget, identifier) {
    const decoratedPhidget = phidget;
    const channel = { // TODO: this RTD specific logic should not be here
      setRTDWireSetup: () => null,
      setRTDType: () => null,
    };
    decoratedPhidget.open = () => new Promise((resolve) => {
      scheduleOnAttach(decoratedPhidget);
      resolve(channel);
    });
    decoratedPhidget.setChannel = (value) => { decoratedPhidget.channel = value; };
    decoratedPhidget.getChannel = () => decoratedPhidget.channel;
    decoratedPhidget.setDeviceLabel = () => null;
    decoratedPhidget.setRTDWireSetup = () => null;
    decoratedPhidget.setRTDType = () => null;

    channelMockService
      .getDecorator(decoratedPhidget.name, identifier)
      .decorate(decoratedPhidget, identifier);
  }
  return {
    decorate,
  };
}

module.exports = (container) => {
  container.service(
    'mockPhidgetDecorator',
    mockPhidgetDecorator,
    'channelSimService',
  );
};
