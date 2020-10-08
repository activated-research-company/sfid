const path = require('path');

function getFileTransportFactory(winston, env) {
  function getNewFileTransport(url, handleExceptions) {
    const formatter = winston
      .format
      .printf(({ level, message, timestamp }) => JSON.stringify({
        timestamp,
        level,
        message,
      }));

    return new winston.transports.DailyRotateFile({
      dirname: path.join(env.dataPath, 'log', url),
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30',
      format: formatter,
      handleExceptions,
    });
  }
  return {
    getNewFileTransport,
  };
}

module.exports = (container) => {
  container.service(
    'fileTransportFactory',
    getFileTransportFactory,
    'winston',
    'env',
  );
};
