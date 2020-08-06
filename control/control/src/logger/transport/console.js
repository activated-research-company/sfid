function getDecorator(winston) {
  function decorate(logger) {
    const decoratedLogger = logger;

    const formatter = winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} | ${level} --> ${message}`;
    });

    const consoleTransport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        formatter,
      ),
      handleExceptions: true,
    });

    decoratedLogger.add(consoleTransport);

    return decoratedLogger;
  }
  return decorate;
}

module.exports = (container) => {
  container.decorator('logger', getDecorator(container.container.winston));
};
