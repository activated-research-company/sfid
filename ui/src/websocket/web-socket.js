const io = require('socket.io-client');

function webSocket({ control }, eventEmitter, logger) {
  // eslint-disable-next-line no-undef
  const url = window.location.href;
  let address;

  if (url.indexOf('http') === 0) {
    if (url.indexOf('localhost') >= 0) {
      address = 'localhost';
    } else {
      address = url.substring(url.indexOf('://') + 3, url.indexOf('/control'));
    }
  } else {
    address = control.host;
  }

  const socket = io(`http://${address}:${control.port}`, { autoConnect: false });

  function echo(event, from, to) {
    from.on(event, (args) => {
      if (event === 'analyze.start') { args = JSON.stringify(args); }
      to.emit(event, JSON.parse(args));
    });
  }

  function connect() {
    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        eventEmitter.emit('connected');
        logger.info('connected');
        resolve();
      });
      socket.on('disconnect', (reason) => {
        eventEmitter.emit('disconnected');
        logger.error(`disconnected: ${reason}`);
      });
      socket.on('reconnect_failed', reject);
      echo('errormessage', socket, eventEmitter);
      echo('ready', socket, eventEmitter);
      echo('mode', socket, eventEmitter);
      echo('startcomplete', socket, eventEmitter);
      echo('clearerror', eventEmitter, socket);
      echo('ready.start', eventEmitter, socket);
      echo('analyze.start', eventEmitter, socket);
      echo('analyze.stop', eventEmitter, socket);
      echo('analyze.complete', socket, eventEmitter);
      echo('shutdown.start', eventEmitter, socket);
      echo('shutdown.stop', eventEmitter, socket);
      echo('shutdown.complete', socket, eventEmitter);
      echo('emergencyshutdown', eventEmitter, socket);
      echo('redlight', socket, eventEmitter);
      echo('orangelight', socket, eventEmitter);
      echo('greenlight', socket, eventEmitter);
      socket.connect();
    });
  }

  function emit(event, args) {
    if (socket.connected) { socket.emit(event.toLowerCase(), args); }
    return this;
  }

  function on(event, handler) {
    socket.on(event.toLowerCase(), (args) => {
      handler(JSON.parse(args));
    });
    return this;
  }

  function off(event, handler) {
    socket.off(event.toLowerCase(), handler);
    return this;
  }

  return {
    connect,
    isConnected: () => socket && socket.connected,
    emit,
    on,
    off,
  };
}

module.exports = (container) => {
  container.service('webSocket', webSocket, 'env', 'eventEmitter', 'logger');
};
