function getApiLogger(loggerFactory, fileTransportFactory) {
  const logger = loggerFactory.getNewLogger();
  logger.add(fileTransportFactory.getNewFileTransport('api'))
  return logger;
}

module.exports = (container) => {
  container.service('apiLogger', getApiLogger, 'loggerFactory', 'fileTransportFactory');
};
