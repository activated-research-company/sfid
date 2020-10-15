function state() {
  const systemState = {
    air: {
      label: 'Air',
      chartTitle: 'Air Flow',
      editTitle: 'Air',
      units: 'SCCM',
      max: 500,
      event: 'air',
      setpoint: 350,
      deviceSetpoint: 0,
      actual: 0,
    },
    airPressure: {
      chartTitle: 'Air Pressure',
      units: 'PSI',
      event: 'air',
      actual: 0,
    },
    hydrogen: {
      label: `H${String.fromCharCode(0x2082)}`,
      chartTitle: 'Hydrogen Flow',
      editTitle: 'Hydrogen',
      units: 'SCCM',
      max: 100,
      event: 'hydrogen',
      setpoint: 50,
      deviceSetpoint: 0,
      actual: 0,
    },
    hydrogenPressure: {
      chartTitle: 'Hydrogen Pressure',
      units: 'PSI',
      event: 'hydrogen',
      actual: 0,
    },
    fidTemperature: {
      label: 'Temp',
      chartTitle: 'Temperature',
      editTitle: 'Temp',
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
      chartTitle: 'Response',
      editTitle: 'FID Sample Rate',
      units: 'mV',
      editUnits: 'Hz',
      min: 1,
      max: 10,
      event: 'fid',
      setpoint: 4,
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
    pump: {
      label: 'Pump',
      event: 'pump',
      setpoint: false,
      actual: false,
      // isEnabled: () => systemState.fidFlame.actual,
      isEnabled: () => true,
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

  systemState.air.secondary = systemState.airPressure;
  systemState.hydrogen.secondary = systemState.hydrogenPressure;

  return systemState;
}

module.exports = (container) => {
  container.service('systemState', state, 'env');
};
