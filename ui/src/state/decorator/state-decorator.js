const webSocketServer = require("../../../../control/src/web-socket/web-socket-server");

function getDecorator(webSocket, eventEmitter, setpointSaver, round) {
  // TODO: continue to break this huge decorator into separate files
  function decorate(systemState) {
    const decoratedSystemState = systemState;

    // setpointSaver.load(decoratedSystemState);

    function setSetpoint(newSetpoint) {
      this.setpoint = newSetpoint;
      // setpointSaver.save(this.event, this.setpoint);
    }

    function setKp(kp) {
      this.kp = kp;
      webSocket.emit(`${this.pidIdentifier}kp`, kp);
    }

    function setKi(ki) {
      this.ki = ki;
      webSocket.emit(`${this.pidIdentifier}ki`, ki);
    }

    function setKd(kd) {
      this.kd = kd;
      webSocket.emit(`${this.pidIdentifier}kd`, kd);
    }

    Object.keys(decoratedSystemState).forEach((state) => {
      decoratedSystemState[state].setSetpoint = setSetpoint;
      if (decoratedSystemState[state].pidIdentifier) {
        decoratedSystemState[state].setKp = setKp;
        decoratedSystemState[state].setKi = setKi;
        decoratedSystemState[state].setKd = setKd;
      }
    });

    function addCommunicationMethods(state) {
      state.synchronize = function() {
        if (typeof this.setpoint === 'boolean') {
          webSocket.emit(this.event, this.setpoint ? (this.flip ? '0' : '1') : (this.flip ? '1' : '0'));
        } else {
          webSocket.emit(this.event, this.setpoint);
        }
      };
      state.turnOff = function() { webSocket.emit(this.event, 0); };
    }

    addCommunicationMethods(decoratedSystemState.hydrogen);
    addCommunicationMethods(decoratedSystemState.air);
    addCommunicationMethods(decoratedSystemState.fidTemperature);
    addCommunicationMethods(decoratedSystemState.fidIgniter);
    addCommunicationMethods(decoratedSystemState.pump);

    function updateState(state, deviceSetpoint, actual, reachedSetpoint, sampleRate) {
      state.lastUpdated = new Date();
      state.deviceSetpoint = deviceSetpoint;
      state.actual = actual;
      state.reachedSetpoint = reachedSetpoint;
      state.sampleRate = sampleRate;
      if (state.event) {
        if (decoratedSystemState.chartingState && state.event === decoratedSystemState.chartingState.event) {
          eventEmitter.emit('chartdata', {
            setpoint: decoratedSystemState.chartingState.getDeviceSetpoint ? decoratedSystemState.chartingState.getDeviceSetpoint() : null,
            actual: decoratedSystemState.chartingState.getActual(),
            title: decoratedSystemState.chartingState.chartTitle,
            units: decoratedSystemState.chartingState.units,
            sampleRate: decoratedSystemState.chartingState.sampleRate,
          });
        }
      }
    }

    webSocket
      .on(decoratedSystemState.hydrogen.event, ({ setpoint, flow, pressure, reachedSetpoint }) => {
        decoratedSystemState.hydrogenPressure.actual = round(pressure, 1);
        updateState(decoratedSystemState.hydrogen, setpoint, round(flow, 1), reachedSetpoint);
      })
      .on(decoratedSystemState.air.event, ({ setpoint, flow, pressure, reachedSetpoint }) => {
        decoratedSystemState.airPressure.actual = round(pressure, 1);
        updateState(decoratedSystemState.air, setpoint, round(flow, 1), reachedSetpoint);
      })
      .on(decoratedSystemState.fidTemperature.event, ({ setpoint, actual, output, kp, ki, kd, reachedSetpoint, sampleRate }) => {
        decoratedSystemState.fidTemperature.kp = kp;
        decoratedSystemState.fidTemperature.ki = ki;
        decoratedSystemState.fidTemperature.kd = kd;
        decoratedSystemState.fidTemperature.output = output;
        updateState(decoratedSystemState.fidTemperature, setpoint, actual, reachedSetpoint, sampleRate);
      })
      .on(decoratedSystemState.fid.event, ({ voltage, temperature, igniting, ignited, sampleRate }) => {
        if (voltage) { decoratedSystemState.fid.voltage = voltage; } // TODO: why is this coming back null?
        updateState(decoratedSystemState.fid, decoratedSystemState.fid.voltage, decoratedSystemState.fid.voltage, null, sampleRate);
        updateState(decoratedSystemState.fidFlameTemperature, temperature, temperature, null, sampleRate);
        updateState(decoratedSystemState.fidIgniter, igniting, igniting);
        updateState(decoratedSystemState.fidFlame, ignited, ignited);
      });

    webSocket.on(decoratedSystemState.pump.event, (args) => {
      updateState(decoratedSystemState.pump, args, args);
    });

    webSocket
      .on(decoratedSystemState.computerUptime.event, ({ actual, sampleRate }) => {
        updateState(decoratedSystemState.computerUptime, actual, actual, false, sampleRate);
      })
      .on(decoratedSystemState.computerTemperature.event, ({ actual, sampleRate }) => {
        updateState(decoratedSystemState.computerTemperature, actual, actual, false, sampleRate);
      })
      .on(decoratedSystemState.computerCpu.event, ({ actual, sampleRate }) => {
        updateState(decoratedSystemState.computerCpu, actual, actual, false, sampleRate);
      })
      .on(decoratedSystemState.computerMemory.event, ({ actual, sampleRate }) => {
        updateState(decoratedSystemState.computerMemory, actual, actual, false, sampleRate);
      })
      .on(decoratedSystemState.computerFsSize.event, ({ actual, sampleRate }) => {
        updateState(decoratedSystemState.computerFsSize, actual, actual, false, sampleRate);
      })
      .on(decoratedSystemState.computerFsUsed.event, ({ actual, sampleRate }) => {
        updateState(decoratedSystemState.computerFsUsed, actual, actual, false, sampleRate);
      })
      .on(decoratedSystemState.computerIp.event, ({ actual, sampleRate }) => {
        updateState(decoratedSystemState.computerIp, actual, actual, false, sampleRate);
      });

    webSocket
      .on(decoratedSystemState.redLight.event, (args) => {
        updateState(decoratedSystemState.redLight, args, args);
      })
      .on(decoratedSystemState.orangeLight.event, (args) => {
        updateState(decoratedSystemState.orangeLight, args, args);
      })
      .on(decoratedSystemState.greenLight.event, (args) => {
        updateState(decoratedSystemState.greenLight, args, args);
      });

    decoratedSystemState.eventEmitter = eventEmitter;

    return decoratedSystemState;
  }

  return decorate;
}

module.exports = (container) => {
  container.decorator(
    'systemState',
    getDecorator(
      container.container.webSocket,
      container.container.eventEmitter,
      container.container.setpointSaver,
      container.container.round,
    ),
  );
};
