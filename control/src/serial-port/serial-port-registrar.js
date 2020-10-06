const SerialPortProbe = require('./serial-port-probe');

function serialPortRegistrar(serialPortRegistry, serialPortFactory, eventEmitter, logger) {
  const registryKeys = Object.keys(serialPortRegistry);

  function probePort(port, registryIndex) {
    const registryKey = registryKeys[registryIndex];
    if (!registryKey) { return; }
    const serialPortProbe = new SerialPortProbe(serialPortRegistry[registryKey], port, serialPortFactory, eventEmitter, logger);
    serialPortProbe.probe(() => probePort(port, registryIndex + 1));
  }

  function registerSerialPorts() {
    serialPortFactory.list().then((ports) => {
      ports.forEach((port) => {
        if (port.path !== '/dev/ttyAMA0') {
          probePort(port.path, 0);
        }
      });
    });
  }

  return {
    registerSerialPorts,
  };
}

module.exports = serialPortRegistrar;
