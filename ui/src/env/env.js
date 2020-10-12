// we cannot destructure this line because webpack needs 'process.env' to fill properly
// eslint-disable-next-line prefer-destructuring
const env = process.env;

function getEnv() {
  // TODO: validate config and throw errors instead of taking defaults

  // eslint-disable-next-line no-undef
  const url = window.location.href;
  const isWebClient = () => url.indexOf('http') === 0;

  const getLocalUrl = (uri) => url.concat(uri);

  return {
    url,
    dataUrl: getLocalUrl(env.DATA_URI),
    logUrl: getLocalUrl(env.LOG_URI),
    productUrl: env.PRODUCT_URL,
    isDev: env.NODE_ENV && env.NODE_ENV === 'development',
    isWeb: isWebClient(),
    uuid: env.BALENA_DEVICE_UUID,
    log: {
      host: env.LOG_HOST,
      port: parseInt(env.LOG_PORT, 10),
      level: parseInt(env.LOG_LEVEL, 10),
    },
    control: {
      host: env.CONTROL_HOST,
      port: env.CONTROL_PORT,
    },
    ui: {
      host: env.UI_HOST,
    },
    dev: env.NODE_ENV && env.NODE_ENV === 'development', // TODO: remove and remove all references
    screenSleepTime: env.SCREEN_SLEEP_TIME,
  };
}

module.exports = (container) => {
  container.service('env', getEnv);
};
