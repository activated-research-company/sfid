function getLogLogger(loggerFactory, consoleTransportFactory, fileTransportFactory) {
  return loggerFactory
    .getNewLogger()
    .add(consoleTransportFactory.getNewConsoleTransport(true))
    .add(fileTransportFactory.getNewFileTransport('log', true));
}

module.exports = (container) => {
  container.service(
    'logLogger',
    getLogLogger,
    'loggerFactory',
    'consoleTransportFactory',
    'fileTransportFactory',
  );
};
