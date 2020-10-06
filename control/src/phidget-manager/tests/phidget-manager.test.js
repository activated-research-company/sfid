const o = require('ospec');

const envMock = {
  useMocks: false,
  phidgetNetworkServerAddress: 3000,
  phidgetNetworkServerPort: 3000,
};

const connectionConstructorSpy = o.spy();
const connectMock = o.spy(() => new Promise((resolve) => resolve()));

class ConnectionMock {
  constructor(port, address) {
    connectionConstructorSpy(port, address);
    this.connect = connectMock;
  }
}

const openMock = o.spy();

class ManagerMock {
  constructor() {
    this.open = openMock;
  }
}

const phidget22Mock = {
  Connection: ConnectionMock,
  Manager: ManagerMock,
};

const phidgetManager = require('../phidget-manager')(envMock, phidget22Mock);

o.spec('phidget manager', () => {
  o('should connect', (done) => {
    phidgetManager.connect().then(() => {
      o(connectMock.callCount).equals(1);
      o(connectionConstructorSpy.args[0]).equals(envMock.phidgetNetworkServerPort);
      o(connectionConstructorSpy.args[1]).equals(envMock.phidgetNetworkServerAddress);
      o(openMock.callCount).equals(1);
      (done)();
    });


  });
});
