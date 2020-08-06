const o = require('ospec');
const getNewChannelSimService = require('../channel-sim-service');

o.spec('channel mock service', () => {
  let digitalOutputChannelSimMock;
  let stepperChannelSimMock;
  let temperatureSensorChannelSimMock;
  let encoderChannelSimMock;
  let channelSimService;

  o.beforeEach(() => {
    digitalOutputChannelSimMock = {};
    stepperChannelSimMock = {};
    temperatureSensorChannelSimMock = {};
    encoderChannelSimMock = {};
    channelSimService = getNewChannelSimService(
      digitalOutputChannelSimMock,
      stepperChannelSimMock,
      temperatureSensorChannelSimMock,
      encoderChannelSimMock,
    );
  });

  o('should return digital output channel mock', () => {
    o(channelSimService.getDecorator('digitalOutput')).equals(digitalOutputChannelSimMock);
  });

  o('should return stepper channel mock', () => {
    o(channelSimService.getDecorator('stepper')).equals(stepperChannelSimMock);
  });

  o('should return temperature sensor channel mock', () => {
    o(channelSimService.getDecorator('temperatureSensor')).equals(temperatureSensorChannelSimMock);
  });

  o('should return encoder channel mock', () => {
    o(channelSimService.getDecorator('encoder')).equals(encoderChannelSimMock);
  });

  o('should return null', () => {
    o(channelSimService.getDecorator('WRONG')).equals(null);
  });
});
