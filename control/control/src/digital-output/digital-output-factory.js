function getDigitalOutputFactory(phidgetFactory) {
  function getNewDigitalOutput(hub, port, hubDevice, channel, id) {
    let connected;
    const phidget = phidgetFactory.getNewDigitalOutput(hub, port, hubDevice, channel, id);

    function getNotConnectedError() {
      return `${id} digital output is not connected`;
    }

    function getNotConnectedPromiseRejection() {
      return new Promise((resolve, reject) => reject(getNotConnectedError()));
    }

    function setOutput(output) {
      if (connected) { return phidget.setDutyCycle(output); }
      return getNotConnectedPromiseRejection();
    }

    function getOutput() {
      if (connected) { return phidget.getDutyCycle(); }
      return 0;
    }

    function connect(onDetach) {
      return new Promise((resolve) => {
        phidget.onAttach = () => {
          connected = true;
          resolve();
        };
        phidget.onDetach = () => {
          connected = false;
          if (onDetach) { onDetach(); }
        };
        phidget.open();
      });
    }

    return {
      connect,
      setOutput,
      getOutput,
    };
  }

  return {
    getNewDigitalOutput,
  };
}

module.exports = (container) => {
  container.service('digitalOutputFactory', getDigitalOutputFactory, 'phidgetFactory');
};
