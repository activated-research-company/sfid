function getControlLogger(loggerFactory, fileTransportFactory) {
  const logger = loggerFactory.getNewLogger();
  logger.add(fileTransportFactory.getNewFileTransport('control'))
  return logger;
}

module.exports = (container) => {
  container.service('controlLogger', getControlLogger, 'loggerFactory', 'fileTransportFactory');
};
