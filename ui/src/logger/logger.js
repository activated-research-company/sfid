function getLogger(winston, { log }) {
  const logLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

  const logger = winston.createLogger({
    level: logLevels[Math.max(log.level, logLevels.length - 1)],
    format: winston.format.combine(
      winston.format.timestamp(),
    ),
    transports: [],
  });

  return logger;
}

module.exports = (container) => {
  container.service('logger', getLogger, 'winston', 'env');
};
