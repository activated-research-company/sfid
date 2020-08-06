const o = require('ospec');
const getNewPhidgetFactory = require('../phidget-factory');

o.spec('phidget factory', () => {
  let phidget22Mock;
  let phidgetDecoratorMock;
  let stepperMockConstructor;
  let temperatureSensorMockConstructor;
  let digitalOutputMockConstructor;
  let encoderMockConstructor;
  let phidgetFactory;

  class Stepper {
    constructor() {
      this.isStepper = true;
      this.setChannel = o.spy();
      stepperMockConstructor();
    }
  }
  class TemperatureSensor {
    constructor() {
      this.isTemperatureSensor = true;
      this.setChannel = o.spy();
      this.setHubPort = o.spy();
      temperatureSensorMockConstructor();
    }
  }
  class DigitalOutput {
    constructor() {
      this.isDigitalOutput = true;
      this.setChannel = o.spy();
      this.setHubPort = o.spy();
      this.setIsHubPortDevice = o.spy();
      digitalOutputMockConstructor();
    }
  }
  class Encoder {
    constructor() {
      this.isEncoder = true;
      this.setChannel = o.spy();
      encoderMockConstructor();
    }
  }

  o.beforeEach(() => {
    stepperMockConstructor = o.spy();
    temperatureSensorMockConstructor = o.spy();
    digitalOutputMockConstructor = o.spy();
    encoderMockConstructor = o.spy();

    phidget22Mock = {
      Stepper,
      TemperatureSensor,
      DigitalOutput,
      Encoder,
    };
    phidgetDecoratorMock = {
      decorate: o.spy((phidget) => {
        const decoratedPhidget = phidget;
        decoratedPhidget.decorated = true;
      }),
    };

    phidgetFactory = getNewPhidgetFactory(phidget22Mock, phidgetDecoratorMock);
  });

  o('should get a new decorated stepper', () => {
    const phidget = phidgetFactory.getNewStepper();

    o(stepperMockConstructor.callCount).equals(1);
    o(phidgetDecoratorMock.decorate.callCount).equals(1);
    o(phidget.setChannel.callCount).equals(1);
    o(phidget.isStepper).equals(true);
    o(phidget.decorated).equals(true);
  });

  o('should get a new decorated temperature sensor', () => {
    const phidget = phidgetFactory.getNewTemperatureSensor(1, 'fid');

    o(temperatureSensorMockConstructor.callCount).equals(1);
    o(phidgetDecoratorMock.decorate.callCount).equals(1);
    o(phidget.setChannel.callCount).equals(1);
    o(phidget.setChannel.args[0]).equals(0);
    o(phidget.setHubPort.callCount).equals(1);
    o(phidget.setHubPort.args[0]).equals(1);
    o(phidget.isTemperatureSensor).equals(true);
    o(phidget.decorated).equals(true);
  });

  o('should get a new decorated digital output', () => {
    const vintHubPortMock = 3;
    const phidget = phidgetFactory.getNewDigitalOutput(vintHubPortMock);

    o(digitalOutputMockConstructor.callCount).equals(1);
    o(phidgetDecoratorMock.decorate.callCount).equals(1);
    o(phidget.setHubPort.callCount).equals(1);
    o(phidget.setHubPort.args[0]).equals(vintHubPortMock);
    o(phidget.isDigitalOutput).equals(true);
    o(phidget.decorated).equals(true);
  });

  o('should get a new decorated encoder', () => {
    const phidget = phidgetFactory.getNewEncoder();

    o(encoderMockConstructor.callCount).equals(1);
    o(phidgetDecoratorMock.decorate.callCount).equals(1);
    o(phidget.isEncoder).equals(true);
    o(phidget.decorated).equals(true);
  });
});
