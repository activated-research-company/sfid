function getLoggerFactory(winston, env) {
  const logLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

  function getNewLogger(options) {
    return winston.createLogger({
      level: logLevels[Math.max(env.level, logLevels.length - 1)],
      format: winston.format.timestamp(),
      transports: [],
    });
  }

  return {
    getNewLogger,
  };
}

module.exports = (container) => {
  container.service('loggerFactory', getLoggerFactory, 'winston', 'env');
};
