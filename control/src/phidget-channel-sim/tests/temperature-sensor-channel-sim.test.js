const o = require('ospec');
const getNewTemperatureSensorChannelSim = require('../temperature-sensor-channel-sim');

o.spec('temperature sensor channel sim', () => {
  const roomTemperature = 23;

  let eventEmitterMock;
  let phidgetMock;
  let identifierMock;
  let temperatureSensorChannelSim;

  o.beforeEach(() => {
    eventEmitterMock = {
      on: o.spy(),
    };
    phidgetMock = {};
    identifierMock = 'id';
    temperatureSensorChannelSim = getNewTemperatureSensorChannelSim(eventEmitterMock);
    temperatureSensorChannelSim.decorate(phidgetMock, identifierMock);
  });

  o.afterEach(() => {
    phidgetMock.detach();
  });

  o('should create on temperature change function', () => {
    phidgetMock.onTemperatureChange();
  });

  o('should set temperature to zero', () => {
    o(phidgetMock.temperature).equals(roomTemperature);
  });

  o('should create get temperature function', () => {
    o(phidgetMock.getTemperature()).equals(roomTemperature);
  });
});
