function webSocketServer({ control }, httpServer, webSocket, eventEmitter, logger) {
  function emit(event, args) {
    webSocket.emit(event, args);
  }

  const events = {
    fidHydrogen: 'fidhydrogen',
    fidAir: 'fidair',
    fidTemperature: 'fidtemperature',
    fidKp: 'fidkp',
    fidKi: 'fidki',
    fidKd: 'fidkd',
    fidIgniter: 'fidigniter',
    emergencyShutdown: 'enableemergencyshutdown',
  };

  function echo(event, from, to) {
    from.on(event, (args) => {
      to.emit(event, args);
    });
  }

  function listen() {
    webSocket.on('connect', (client) => {
      logger.debug(`${client.conn.remoteAddress} connected`);
      client.on('disconnect', (reason) => { logger.error(`${client.conn.remoteAddress} disconnected: ${reason}`); });
      Object.keys(events).forEach((event) => {
        client.on(events[event], (args) => {
          eventEmitter.emit(`set${events[event]}`, args);
        });
      });
      echo('analyze.start', client, eventEmitter);
      echo('analyze.stop', client, eventEmitter);
      echo('shutdown.start', client, eventEmitter);
      echo('shutdown.stop', client, eventEmitter);
      echo('emergencyshutdown', client, eventEmitter);
      echo('setdate', client, eventEmitter);
      echo('settime', client, eventEmitter);
      echo('clearerror', client, eventEmitter);
    });
    httpServer.listen(control.port);

    eventEmitter.all((event, args) => {
        emit(event, JSON.stringify(args));
    });
  }

  return {
    events,
    listen,
  };
}

module.exports = (container) => {
  container.service('webSocketServer', webSocketServer, 'env', 'httpServer', 'webSocket', 'eventEmitter', 'logger');
};
