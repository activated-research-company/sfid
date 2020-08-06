const o = require('ospec');
const getNewDigitalOutputChannelSim = require('../digital-output-channel-sim');

o.spec('digital output channel sim', () => {
  let eventEmitterMock;
  let phidgetMock;
  let identifierMock;
  let digitalOutputChannelSim;

  o.beforeEach(() => {
    eventEmitterMock = {
      emit: o.spy(),
    };
    phidgetMock = {};
    identifierMock = 'id';
    digitalOutputChannelSim = getNewDigitalOutputChannelSim(eventEmitterMock);
  });

  o('should add set/get duty cycle functions to phidget', (done) => {
    digitalOutputChannelSim.decorate(phidgetMock, identifierMock);
    phidgetMock.setDutyCycle(1).then(() => {
      o(phidgetMock.getDutyCycle()).equals(1);
      o(eventEmitterMock.emit.callCount).equals(1);
      o(eventEmitterMock.emit.args[0]).equals(`${identifierMock}dutycycle`);
      o(eventEmitterMock.emit.args[1]).equals(1);
      (done)();
    });
  });
});
