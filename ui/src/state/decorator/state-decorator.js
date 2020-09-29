function getDecorator(webSocket, eventEmitter, setpointSaver, round) {
  // TODO: continue to break this huge decorator into separate files
  function decorate(systemState) {
    const decoratedSystemState = systemState;

    // setpointSaver.load(decoratedSystemState);

    function setSetpoint(newSetpoint) {
      this.setpoint = newSetpoint;
      setpointSaver.save(this.event, this.setpoint);
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
        } else if (this.event === 'laserpower') {
          webSocket.emit(this.event, Math.round((this.setpoint / 100) * process.env.LASER_MAX_POWER));
        } else {
          webSocket.emit(this.event, this.setpoint);
        }
      };
      state.turnOff = function() { webSocket.emit(this.event, 0); };
    }

    addCommunicationMethods(decoratedSystemState.fidHydrogen);
    addCommunicationMethods(decoratedSystemState.fidAir);
    addCommunicationMethods(decoratedSystemState.fidTemperature);
    addCommunicationMethods(decoratedSystemState.fidIgniter);

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
      .on(decoratedSystemState.fidHydrogen.event, (args) => {
        decoratedSystemState.fidHydrogenPressure.actual = round(args.pressure, 1);
        updateState(decoratedSystemState.fidHydrogen, args.setpoint, round(args.flow, 1), args.reachedSetpoint);
      })
      .on(decoratedSystemState.fidAir.event, (args) => {
        decoratedSystemState.fidAirPressure.actual = round(args.pressure, 1);
        updateState(decoratedSystemState.fidAir, args.setpoint, round(args.flow, 1), args.reachedSetpoint);
      })
      .on(decoratedSystemState.fidTemperature.event, (args) => {
        decoratedSystemState.fidTemperature.kp = args.kp;
        decoratedSystemState.fidTemperature.ki = args.ki;
        decoratedSystemState.fidTemperature.kd = args.kd;
        decoratedSystemState.fidTemperature.output = args.output;
        updateState(decoratedSystemState.fidTemperature, args.setpoint, args.actual, args.reachedSetpoint, args.sampleRate);
      })
      .on(decoratedSystemState.fid.event, (args) => {
        if (args.voltage) { decoratedSystemState.fid.voltage = args.voltage; } // TODO: why is this coming back null?
        updateState(decoratedSystemState.fid, decoratedSystemState.fid.voltage, decoratedSystemState.fid.voltage, null, args.sampleRate);
        updateState(decoratedSystemState.fidFlameTemperature, args.temperature, args.temperature, null, args.sampleRate);
        updateState(decoratedSystemState.fidIgniter, args.igniting, args.igniting);
        updateState(decoratedSystemState.fidFlame, args.ignited, args.ignited);
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
