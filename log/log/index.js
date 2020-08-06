// TODO: move this into src (same with api) - change docker file to support

const http = require('http');
const { apiLogger, appLogger, logLogger, env } = require('./container')

logLogger.info('initializing');

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') { return; }

  let body = '';
  req.on('data', (chunk) => { body += chunk.toString(); });
  req.on('end', () => {
    res.end('ok');

    try { json = JSON.parse(body); }
    catch (e) { logLogger.error(e); }

    switch (req.url) {
      case '/api':
        apiLogger[json.level]({ level: json.level, message: json.message, timestamp: json.timestamp });
        break;
      case '/app':
        appLogger[json.level]({ level: json.level, message: json.message, timestamp: json.timestamp });
        break;
      default:
        logLogger.error(`received post on invalid url '${req.url}'`);
        break;
    }
  });
});

server.listen(env.port);