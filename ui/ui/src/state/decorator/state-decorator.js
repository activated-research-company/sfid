function getDecorator(webSocket, eventEmitter, setpointSaver, round) {
  // TODO: continue to break this huge decorator into separate files
  function decorate(systemState) {
    const decoratedSystemState = systemState;

    setpointSaver.load(decoratedSystemState);

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

    addCommunicationMethods(decoratedSystemState.cellAir);
    addCommunicationMethods(decoratedSystemState.cellTemperature);
    addCommunicationMethods(decoratedSystemState.cellDiskSpeed);
    addCommunicationMethods(decoratedSystemState.cellPressure);
    addCommunicationMethods(decoratedSystemState.diversionValve);
    addCommunicationMethods(decoratedSystemState.laserHardInterlock);
    addCommunicationMethods(decoratedSystemState.laserEnabled);
    addCommunicationMethods(decoratedSystemState.laserPilot);
    addCommunicationMethods(decoratedSystemState.laserOutput);
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
      .on(decoratedSystemState.cellAir.event, (args) => {
        decoratedSystemState.cellAirPressure.actual = round(args.pressure, 1);
        updateState(decoratedSystemState.cellAir, args.setpoint, round(args.flow, 1), args.reachedSetpoint);
      })
      .on(decoratedSystemState.cellTemperature.event, (args) => {
        decoratedSystemState.cellTemperature.kp = args.kp;
        decoratedSystemState.cellTemperature.ki = args.ki;
        decoratedSystemState.cellTemperature.kd = args.kd;
        decoratedSystemState.cellTemperature.output = args.output;
        updateState(decoratedSystemState.cellTemperature, args.setpoint, args.actual, args.reachedSetpoint, args.sampleRate);
      })
      .on(decoratedSystemState.cellDiskSpeed.event, (args) => {
        updateState(decoratedSystemState.cellDiskSpeed, args.setpoint, args.actual, args.reachedSetpoint, args.sampleRate);
      })
      .on(decoratedSystemState.cellPressure.event, (args) => {
        updateState(decoratedSystemState.cellPressure, args.setpoint, round(args.pressure, 3), args.reachedSetpoint);
      })
      .on(decoratedSystemState.diversionValve.event, (args) => {
        updateState(decoratedSystemState.diversionValve, !args, !args);
      });

    webSocket
      .on(decoratedSystemState.laserHardInterlock.event, (args) => {
        updateState(decoratedSystemState.laserHardInterlock, (args === '1'), (args === '1'));
      })
      .on(decoratedSystemState.laserEnabled.event, (args) => {
        updateState(decoratedSystemState.laserEnabled, (args.actual === '0'), (args.actual === '0'));
      })
      .on(decoratedSystemState.laserPilot.event, (args) => {
        updateState(decoratedSystemState.laserPilot, (args !== '0'), (args !== '0'));
      })
      .on(decoratedSystemState.laserOutput.event, (args) => {
        const setpoint = Math.round((args.setpoint / process.env.LASER_MAX_POWER) * 100);
        const actual = Math.round((args.actual / process.env.LASER_MAX_POWER) * 100);
        updateState(decoratedSystemState.laserOutput, setpoint, actual, args.reachedSetpoint);
      })
      .on(decoratedSystemState.laserBoxTemperature.event, (args) => {
        updateState(decoratedSystemState.laserBoxTemperature, args, args);
      })
      .on('laser', (args) => {
        const json = JSON.parse(args);
        updateState(decoratedSystemState.laserHardInterlock, json.interlockIsEngaged, json.interlockIsEngaged, json.sampleRate);
        updateState(decoratedSystemState.laserInterlock1, json.interlock1IsEngaged, json.interlock1IsEngaged, json.sampleRate);
        updateState(decoratedSystemState.laserInterlock2, json.interlock2IsEngaged, json.interlock2IsEngaged, json.sampleRate);
        updateState(decoratedSystemState.laserEnabled, json.powerSupplyIsOn, json.powerSupplyIsOn, json.sampleRate);
        updateState(decoratedSystemState.laserPilot, json.pilotIsOn, json.pilotIsOn, json.sampleRate);

        const setpoint = Math.round((json.powerSetpoint / process.env.LASER_MAX_POWER) * 100);
        const actual = Math.round((json.power / process.env.LASER_MAX_POWER) * 100);

        updateState(decoratedSystemState.laserOutput, setpoint, actual, json.reachedSetpoint, json.sampleRate);
        eventEmitter.emit(decoratedSystemState.laserOutput.event, {
          setpoint: json.powerSetpoint,
          actual: json.power,
        });

        const calculatedSetpoint = Math.round((json.power / process.env.LASER_MAX_POWER) * 100);
        const calculatedActual = Math.round((json.powerCalculated / process.env.LASER_MAX_POWER) * 100);

        updateState(decoratedSystemState.laserPowerCalculated, calculatedSetpoint, calculatedActual, json.sampleRate);
        eventEmitter.emit(decoratedSystemState.laserPowerCalculated.event, {
          setpoint: calculatedSetpoint,
          actual: calculatedActual,
        });

        updateState(decoratedSystemState.laserBoxTemperature, json.temperature, json.temperature, json.sampleRate);
        eventEmitter.emit(decoratedSystemState.laserBoxTemperature.event, json.temperature, json.sampleRate);
      })
      .on(decoratedSystemState.laserHousingTemperature.event, (args) => {
        updateState(decoratedSystemState.laserHousingTemperature, args.actual, args.actual, args.sampleRate);
      });

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
      })
      .on(decoratedSystemState.fidIgniter.event, (args) => {
        updateState(decoratedSystemState.fidIgniter, args, args);
      })
      .on(decoratedSystemState.fidFlame.event, (args) => {
        updateState(decoratedSystemState.fidFlame, args, args);
      });

    webSocket
      .on(decoratedSystemState.computerUptime.event, (args) => {
        updateState(decoratedSystemState.computerUptime, args.uptime, args.uptime, false, decoratedSystemState.computerUptime.sampleRate);
      })
      .on(decoratedSystemState.computerTemperature.event, (args) => {
        updateState(decoratedSystemState.computerTemperature, args.max, args.max, false, decoratedSystemState.computerTemperature.sampleRate);
      })
      .on(decoratedSystemState.computerCpu.event, (args) => {
        updateState(decoratedSystemState.computerCpu, args.currentload, args.currentload, false, decoratedSystemState.computerCpu.sampleRate);
      })
      .on(decoratedSystemState.computerMemory.event, (args) => {
        updateState(decoratedSystemState.computerMemory, (args.used / args.total) * 100, (args.used / args.total) * 100, false, decoratedSystemState.computerMemory.sampleRate);
      })
      .on(decoratedSystemState.computerFsSize.event, (args) => {
        updateState(decoratedSystemState.computerFsSize, args / 1073741824, args / 1073741824, false, decoratedSystemState.computerFsSize.sampleRate);
      })
      .on(decoratedSystemState.computerFsUsed.event, (args) => {
        updateState(decoratedSystemState.computerFsUsed, args / 1073741824, args / 1073741824, false, decoratedSystemState.computerFsSize.sampleRate);
      });

    webSocket
      .on(decoratedSystemState.cellCompartmentLeak.event, (args) => {
        updateState(decoratedSystemState.cellCompartmentLeak, args, args, decoratedSystemState.cellCompartmentLeak.sampleRate);
      })
      .on(decoratedSystemState.cellCompartmentLeakVolts.event, (args) => {
        updateState(decoratedSystemState.cellCompartmentLeakVolts, args, args, decoratedSystemState.cellCompartmentLeakVolts.sampleRate);
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
