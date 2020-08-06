const random = require('../../utilitites/random');

function getFlowControllerHubPortMock() {
  function setFlowControllerSetpoint(setpoint) {
    this.setpoint = parseFloat(setpoint);
    setTimeout(this.updateFlow.bind(this), 500);
  }

  function updateFlow() {
    this.flow += parseFloat(((this.setpoint - this.flow) / 2).toFixed(2));
    this.pressure = parseFloat((this.flow / 10).toFixed(1));
    if (Math.abs(this.setpoint - this.flow) > 0.01) {
      setTimeout(this.updateFlow.bind(this), 500);
    } else {
      this.flow = this.setpoint;
      this.pressure = parseFloat((this.flow / 10).toFixed(1));
    }
  }

  function setPressureControllerSetpoint(setpoint) {
    this.setpoint = setpoint;
    this.pressure = setpoint;
  }

  function createFlowController(address, gas) {
    return {
      address,
      gas,
      pressure: 0,
      flow: 0,
      setpoint: 0,
      setSetpoint: setFlowControllerSetpoint,
      updateFlow,
    };
  }

  function createPressureController(address) {
    return {
      address,
      gas: 'Air',
      pressure: 0,
      flow: 0,
      setpoint: 0,
      setSetpoint: setPressureControllerSetpoint,
    };
  }

  const controllers = {
    fidAir: createFlowController('a', 'Air'),
    fidHydrogen: createFlowController('h', 'Hydrogen'),
    cellAir: createFlowController('x', 'Air'),
    cellPressure: createPressureController('c'),
  };

  function getController(address) {
    let controller;
    Object.keys(controllers).forEach((c) => {
      if (controllers[c].address === address) {
        controller = controllers[c];
      }
    });
    return controller;
  }

  function getResponse(message) {
    const command = message.split('\r')[0];
    const c = getController(command.slice(0, 1));

    if (c) {
      if (command !== c.address) {
        c.setSetpoint(parseFloat(command.slice(2)));
      }
      const flow = Math.max(0, c.flow + ((random(0, 20) / 100) * random(-1, 1)));
      // TODO: negative pressure probably shouldn't be possible for MFCs
      const pressure = c.pressure + ((random(0, 10) / 100) * random(-1, 1));
      return Buffer.from(`${c.address} ${pressure > 0 ? '+' : ''}${pressure} +00.00 +00.00 +${flow} +${c.setpoint}    ${c.gas}`);
    }

    return null;
  }

  return {
    getResponse,
  };
}

module.exports = getFlowControllerHubPortMock;
