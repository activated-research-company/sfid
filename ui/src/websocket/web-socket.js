const io = require('socket.io-client');

function webSocket({ control, isWeb, isDev, url }, eventEmitter, logger) {
  const getUri = () => {
    let address;
    if (isWeb && !isDev) {
      const http = 'http://';
      const addressStart = url.indexOf(http) + http.length;
      const addressEnd = url.substring(addressStart).search(/[:/]/g, addressStart) + addressStart;
      address = url.substring(addressStart, addressEnd >= 0 ? addressEnd : null);
    } else {
      address = control.host;
    }

    return `http://${address}:${control.port}`;
  };

  const uri = getUri();

  logger.debug(`web socket connecting to ${uri}`);

  const socket = io(uri, { autoConnect: false });

  const needToStringify = (event) => event === 'analyze.start'
      || event === 'shutdown.start'
      || event === 'analyze.stop'
      || event === 'shutdown.stop';

  function echo(event, from, to) {
    from.on(event, (args) => {
      if (!args) {
        to.emit(event, args);
        return;
      }
      // TODO: stringify echoes out to external and parse echoes in from external
      if (needToStringify(event)) { args = JSON.stringify(args); }
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
