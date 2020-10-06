const io = require('socket.io');

function webSocket(httpServer) {
  return io(httpServer);
}

module.exports = (container) => {
  container.service('webSocket', webSocket, 'httpServer');
};
