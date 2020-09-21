function state() {
  const systemState = {
    fidAir: {
      label: 'Air',
      chartTitle: 'FID Air Flow',
      editTitle: 'FID Air',
      units: 'SCCM',
      max: 500,
      event: 'fidair',
      setpoint: 350,
      deviceSetpoint: 0,
      actual: 0,
    },
    fidAirPressure: {
      chartTitle: 'FID Air Pressure',
      units: 'PSI',
      event: 'fidair',
      actual: 0,
    },
    fidHydrogen: {
      label: `H${String.fromCharCode(0x2082)}`,
      chartTitle: 'FID Hydrogen Flow',
      editTitle: 'FID Hydrogen',
      units: 'SCCM',
      max: 100,
      event: 'fidhydrogen',
      setpoint: 50,
      deviceSetpoint: 0,
      actual: 0,
    },
    fidHydrogenPressure: {
      chartTitle: 'FID Hydrogen Pressure',
      units: 'PSI',
      event: 'fidhydrogen',
      actual: 0,
    },
    fidTemperature: {
      label: 'Temp',
      chartTitle: 'FID Temperature',
      editTitle: 'FID Temp',
      units: `${String.fromCharCode(176)}C`,
      max: 450,
      event: 'fidtemperature',
      setpoint: 400,
      deviceSetpoint: 0,
      pidIdentifier: 'fid',
      kp: 0,
      ki: 0,
      kd: 0,
      actual: 0,
    },
    fid: {
      label: 'Response',
      chartTitle: 'FID Response',
      units: 'mV',
      event: 'fid',
      actual: 0,
      voltage: 0,
    },
    fidIgniter: {
      label: 'Igniter',
      event: 'fidigniter',
      setpoint: false,
      actual: false,
      isEnabled: () => !systemState.fidFlame.actual,
    },
    fidFlame: {
      label: 'Flame',
      event: 'fidignited',
      setpoint: false,
      actual: false,
      isEnabled: () => false,
    },
    fidFlameTemperature: {
      label: 'Flame Temp',
      event: 'fid.flametemp',
      chartTitle: 'FID Flame Temperature',
      units: `${String.fromCharCode(176)}C`,
      actual: 0,
    },
    computerUptime: {
      label: 'Uptime',
      units: '',
      event: 'computer.time',
      actual: 0,
    },
    computerTemperature: {
      label: 'CPU Temp',
      chartTitle: 'CPU Temperature',
      sampleRate: 1000,
      units: `${String.fromCharCode(176)}C`,
      event: 'computer.temperature',
      actual: 0,
    },
    computerCpu: {
      label: 'CPU',
      chartTitle: 'CPU Usage',
      sampleRate: 1000,
      units: '%',
      event: 'computer.cpu',
      actual: 0,
    },
    computerMemory: {
      label: 'Memory',
      chartTitle: 'Memory Usage',
      sampleRate: 1000,
      units: '%',
      event: 'computer.memory',
      actual: 0,
    },
    computerFsSize: {
      label: 'Storage',
      sampleRate: 1000,
      units: 'GB',
      event: 'computer.fssize',
      actual: 0,
    },
    computerFsUsed: {
      label: 'Used',
      sampleRate: 1000,
      units: 'GB',
      event: 'computer.fsused',
      actual: 0,
    },
    computerIp: {
      label: 'IP',
      units: '',
      event: 'computer.ip',
      actual: '',
    },
    redLight: {
      event: 'redlight',
      actual: false,
    },
    orangeLight: {
      event: 'orangelight',
      actual: false,
    },
    greenLight: {
      event: 'greenlight',
      actual: false,
    },
  };

  systemState.fidAir.secondary = systemState.fidAirPressure;
  systemState.fidHydrogen.secondary = systemState.fidHydrogenPressure;

  return systemState;
}

module.exports = (container) => {
  container.service('systemState', state, 'env');
};
