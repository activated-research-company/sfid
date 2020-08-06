const o = require('ospec');
const getDigitalOutput = require('../digital-output-factory');

o.spec('digital output', () => {
  let phidgetMock;
  let phidgetFactoryMock;
  let vintHubPortMock;
  let digitalOutput;

  o.beforeEach(() => {
    phidgetMock = {
      open: o.spy(),
      setDutyCycle: o.spy(),
    };
    phidgetFactoryMock = {
      getNewDigitalOutput: o.spy(() => phidgetMock),
    };
    vintHubPortMock = 5;

    digitalOutput = getDigitalOutput(phidgetFactoryMock, vintHubPortMock);
  });

  o('should get new digital output from phidget factory', () => {
    o(phidgetFactoryMock.getNewDigitalOutput.callCount).equals(1);
    o(phidgetFactoryMock.getNewDigitalOutput.args[0]).equals(vintHubPortMock);
  });

  o('should open channel on connect', () => {
    digitalOutput.connect();

    o(phidgetMock.open.callCount).equals(1);
  });

  o('should set output to zero on attach', () => {
    phidgetMock.onAttach();

    o(phidgetMock.setDutyCycle.callCount).equals(1);
    o(phidgetMock.setDutyCycle.args[0]).equals(0);
  });

  o('should not set duty cycle when not connected', () => {
    const outputMock = 5;

    digitalOutput.setOutput(outputMock);

    o(phidgetMock.setDutyCycle.callCount).equals(0);
  });

  o('should set duty cycle when connected', () => {
    const outputMock = 5;
    phidgetMock.onAttach();

    o(phidgetMock.setDutyCycle.callCount).equals(1);
    o(phidgetMock.setDutyCycle.args[0]).equals(0);

    digitalOutput.setOutput(outputMock);
    o(phidgetMock.setDutyCycle.callCount).equals(2);
    o(phidgetMock.setDutyCycle.args[0]).equals(outputMock);
  });

  o('should not set duty cycle after detach', () => {
    const outputMock = 5;
    phidgetMock.onAttach();

    o(phidgetMock.setDutyCycle.callCount).equals(1);
    o(phidgetMock.setDutyCycle.args[0]).equals(0);

    digitalOutput.setOutput(outputMock);
    o(phidgetMock.setDutyCycle.callCount).equals(2);
    o(phidgetMock.setDutyCycle.args[0]).equals(outputMock);

    phidgetMock.onDetach();
    digitalOutput.setOutput(outputMock);
    o(phidgetMock.setDutyCycle.callCount).equals(2);
  });
});
