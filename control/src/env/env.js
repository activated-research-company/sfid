const path = require('path');

const { env } = process;

function getEnv() {
  const isDev = env.NODE_ENV === 'development';

  if (isDev) {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const dotenv = require('dotenv');
    dotenv.config({ path: path.join(process.cwd(), '..', '.env') });
    dotenv.config();
  }

  function getDataPath(directory) {
    if (directory[0] === '~') {
      return path.join(env.HOME, directory.slice(1));
    }
    return directory;
  }

  function isTrue(envVar) {
    return envVar === 'true';
  }

  return {
    balena: {
      supervisor: {
        address: env.BALENA_SUPERVISOR_ADDRESS,
        apiKey: env.BALENA_SUPERVISOR_API_KEY,
      },
    },
    isDev,
    dataPath: getDataPath(env.DATA_PATH),
    log: {
      host: env.LOG_HOST,
      port: parseInt(env.LOG_PORT, 10),
      level: parseInt(env.LOG_LEVEL, 10),
    },
    phidget: {
      host: env.PHIDGET_HOST,
      port: parseInt(env.PHIDGET_PORT, 10),
      useSim: isTrue(env.PHIDGET_USE_SIM),
    },
    control: {
      host: env.CONTROL_HOST,
      port: parseInt(env.CONTROL_PORT, 10),
    },
    influxdb: {
      host: env.INFLUXDB_HOST,
      port: env.INFLUXDB_PORT,
      useSim: isTrue(env.INFLUXDB_USE_SIM),
    },
    startup: {
      time: parseInt(env.STARTUP_TIME, 10),
      useSim: isTrue(env.STARTUP_USE_SIM),
    },
    fc: {
      isAttached: isTrue(env.FC_IS_ATTACHED),
      useSim: isTrue(env.FC_USE_SIM),
      simPort: env.FC_SIM_PORT,
      baudRate: parseInt(env.FC_BAUD_RATE, 10),
    },
    fid: {
      isAttached: isTrue(env.FID_IS_ATTACHED),
      useSim: isTrue(env.FID_USE_SIM),
      simPort: env.FID_SIM_PORT,
      sampleRate: parseInt(env.FID_SAMPLE_RATE, 10),
      temperatureSensor: {
        isAttached: isTrue(env.FID_TEMPERATURE_SENSOR_IS_ATTACHED),
        hub: env.FID_TEMPERATURE_SENSOR_HUB,
        port: parseInt(env.FID_TEMPERATURE_SENSOR_PORT, 10),
      },
      heater: {
        isAttached: isTrue(env.FID_HEATER_IS_ATTACHED),
        hub: env.FID_HEATER_HUB,
        port: parseInt(env.FID_HEATER_PORT, 10),
        channel: parseInt(env.FID_HEATER_CHANNEL, 10),
      },
      pump: {
        isAttached: isTrue(env.PUMP_IS_ATTACHED),
        hub: env.PUMP_HUB,
        port: parseInt(env.PUMP_PORT, 10),
      },
    },
    light: {
      red: {
        isAttached: isTrue(env.RED_LIGHT_IS_ATTACHED),
        hub: env.RED_LIGHT_HUB,
        port: parseInt(env.RED_LIGHT_PORT, 10),
      },
      orange: {
        isAttached: isTrue(env.ORANGE_LIGHT_IS_ATTACHED),
        hub: env.ORANGE_LIGHT_HUB,
        port: parseInt(env.ORANGE_LIGHT_PORT, 10),
      },
      green: {
        isAttached: isTrue(env.GREEN_LIGHT_IS_ATTACHED),
        hub: env.GREEN_LIGHT_HUB,
        port: parseInt(env.GREEN_LIGHT_PORT, 10),
      },
    },
  };
}

module.exports = (container) => {
  container.service('env', getEnv);
};
