function getAppLogger(loggerFactory, fileTransportFactory) {
  const logger = loggerFactory.getNewLogger();
  logger.add(fileTransportFactory.getNewFileTransport('app'))
  return logger;
}

module.exports = (container) => {
  container.service('appLogger', getAppLogger, 'loggerFactory', 'fileTransportFactory');
};
