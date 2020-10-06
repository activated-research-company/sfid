const o = require('ospec');
const getNewTemperatureSensor = require('../temperature-sensor');

o.spec('temperature sensor', () => {
  let phidget22Mock;
  let phidgetFactoryMock;
  let vintHubPortMock;
  let identifierMock;
  let phidgetMock;
  let temperatureSensor;

  o.beforeEach(() => {
    phidget22Mock = {
      RTDWireSetup: {
        WIRES_2: 2,
      },
      RTDType: {
        PT100_3850: 3850,
      },
    };
    phidgetFactoryMock = {
      getNewTemperatureSensor: o.spy(),
    };
    vintHubPortMock = 1;
    identifierMock = 'fid';
    phidgetMock = {
      open: o.spy(() => new Promise((resolve) => {
        resolve({
          setRTDWireSetup: o.spy(),
          setRTDType: o.spy(),
        });
      })),
      temperature: 10.5,
      getTemperature: o.spy(function() {
        return this.temperature;
      }),
    };
    phidgetFactoryMock = {
      getNewTemperatureSensor: () => phidgetMock,
    };

    temperatureSensor = getNewTemperatureSensor(
      phidget22Mock,
      phidgetFactoryMock,
      vintHubPortMock,
      identifierMock);
  });

  o('should open channel on connect', () => {
    temperatureSensor.connect();

    o(phidgetMock.open.callCount).equals(1);
  });

  o('should get temperature', () => {
    o(temperatureSensor.getTemperature()).equals(phidgetMock.temperature);
    o(phidgetMock.getTemperature.callCount).equals(1);
  });

  o('should invoke listener on temperature change', () => {
    const onDataMock = o.spy();
    const temperatureMock = 4.75;
    temperatureSensor.onData(onDataMock);

    phidgetMock.onTemperatureChange(temperatureMock);

    o(onDataMock.callCount).equals(1);
    o(onDataMock.args[0]).equals(temperatureMock);
  });
});