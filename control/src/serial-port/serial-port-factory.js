const SerialPort = require('serialport');

function serialPortFactory(serialPortMockService, env) {
  class SerialPortMock {
    constructor(port) {
      this.eventRegistry = [];
      this.portMock = serialPortMockService.getMock(port);
    }

    on(event, callback) {
      this.eventRegistry.push({ event, callback });
      if (event === 'data') {
        this.portMock.onData = callback;
        if (this.portMock.hasConnectionResponse) { this.write(''); }
      }
      return this;
    }

    pipe() {
      return this;
    }

    write(message) {
      const response = this.portMock.getResponse(message);
      if (!(response === undefined || response === null)) {
        const event = this.eventRegistry.find((e) => e.event === 'data');
        if (event) { event.callback(response); }
      }
    }

    open() {
      this.eventRegistry.find((event) => event.event === 'open').callback();
      this.isOpen = true;
    }

    close() {
      const onClose = this.eventRegistry.find((event) => event.event === 'close');
      if (onClose) { onClose.callback(); }
    }
  }

  function list() {
    return new Promise((resolve) => {
      const ports = [];
      if (env.fc.isAttached) { ports.push({ path: env.fc.simPort }); }
      if (env.fid.isAttached) { ports.push({ path: env.fid.simPort }); }
      resolve(ports);
    });
  }

  function getNewSerialPort(path, options) {
    if ((env.fc.isAttached && env.fc.useSim && path === env.fc.simPort) || (env.fid.isAttached && env.fid.useSim && path === env.fid.simPort)) {
      return new SerialPortMock(path, options);
    }
    return new SerialPort(path, options);
  }

  return {
    getNewSerialPort,
    list: env.fc.useSim && env.fid.useSim ? list : SerialPort.list, // TODO: combine simulation with non simulation
  };
}

module.exports = (container) => {
  container.service('serialPortFactory', serialPortFactory, 'serialPortMockService', 'env');
};
