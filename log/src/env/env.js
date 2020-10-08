const path = require('path');
const { env } = process;

function getEnv() {
  // TODO: validate env config and throw errors if something isn't found instead of taking defaults in code
  if (process.env.NODE_ENV === 'development') {
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
    dataPath: getDataPath(process.env.DATA_PATH),
    log: {
      host: env.LOG_HOST,
      port: parseInt(env.LOG_PORT, 10),
      level: parseInt(env.LOG_LEVEL, 10),
    },
    influxdb: {
      host: env.INFLUXDB_HOST,
      port: env.INFLUXDB_PORT,
      useSim: isTrue(env.INFLUXDB_USE_SIM),
    },
    control: {
      host: env.CONTROL_HOST,
    },
    ui: {
      host: env.UI_HOST,
    },
  };
}

module.exports = (container) => {
  container.service('env', getEnv);
};
