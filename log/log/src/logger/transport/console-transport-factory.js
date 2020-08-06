function getConsoleTransportFactory(winston) {
  function getNewConsoleTransport() {
    const formatter = winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} | ${level} --> ${message}`;
    });
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        formatter,
      ),
      handleExceptions: true,
    });
  }
  return {
    getNewConsoleTransport,
  };
}

module.exports = (container) => {
  container.service('consoleTransportFactory', getConsoleTransportFactory, 'winston');
};
