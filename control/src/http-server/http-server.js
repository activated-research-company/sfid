const http = require('http');

function httpServer() {
  return http.createServer();
}

module.exports = (container) => {
  container.service('httpServer', httpServer);
};
