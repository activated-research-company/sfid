const http = require('http');
const { controlLogger, uiLogger, logLogger, influxdb, env } = require('./container')

logLogger.info('initializing');

const loggers = {
  [`/${env.control.host}`]: controlLogger,
  [`/${env.ui.host}`]: uiLogger,
};

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') { return; }

  let body = '';
  req.on('data', (chunk) => { body += chunk.toString(); });
  req.on('end', () => {
    res.end('ok');

    if (loggers[req.url]) {
      try {
        json = JSON.parse(body);
        loggers[req.url][json.level]({ level: json.level, message: json.message, timestamp: json.timestamp });
        influxdb.writePoints([{
          measurement: 'log',
          fields: {
            message: json.message,
          },
          tags: {
            container: req.url.substring(1),
            level: json.level,
          },
        }]);
      } catch (e) {
        logLogger.error(e);
      }
    } else {
      logLogger.error(`received post on invalid url '${req.url}'`);
    }
  });
});

server.listen(env.log.port);