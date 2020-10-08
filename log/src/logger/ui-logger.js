function getUiLogger(loggerFactory, fileTransportFactory) {
  const logger = loggerFactory.getNewLogger();
  logger.add(fileTransportFactory.getNewFileTransport('ui'));
  return logger;
}

module.exports = (container) => {
  container.service('uiLogger', getUiLogger, 'loggerFactory', 'fileTransportFactory');
};
