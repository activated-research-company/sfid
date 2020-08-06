function getDecorator(winston, { log }) {
  function decorate(logger) {
    const decoratedLogger = logger;

    const httpTransport = new winston.transports.Http({
      host: log.host,
      port: log.port,
      path: 'app',
      handleExceptions: true,
    });

    decoratedLogger.add(httpTransport);

    return decoratedLogger;
  }
  return decorate;
}

module.exports = (container) => {
  container.decorator(
    'logger',
    getDecorator(
      container.container.winston,
      container.container.env,
    ),
  );
};
