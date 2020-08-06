function webSocketServer({ control }, httpServer, webSocket, eventEmitter, logger) {
  function emit(event, args) {
    webSocket.emit(event, args);
  }

  const events = {
    cellAir: 'cellair',
    cellTemperature: 'celltemperature',
    cdllKp: 'cellkp',
    cellKi: 'cellki',
    cellKd: 'cellkd',
    diskRpm: 'diskrpm',
    cellPressure: 'cellpressure',
    diversionValve: 'diversionvalve',
    laserHardInterlock: 'laserhardinterlock',
    laserSoftInterlock: 'lasersoftinterlock',
    laserPilot: 'laserpilot',
    laserPower: 'laserpower',
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
      logger.debug('app connected');
      client.on('disconnect', (reason) => { logger.error(`app disconnected: ${reason}`); });
      Object.keys(events).forEach((event) => {
        client.on(events[event], (args) => {
          eventEmitter.emit(`set${events[event]}`, args);
        });
      });
      echo('standby.start', client, eventEmitter);
      echo('standby.stop', client, eventEmitter);
      echo('analyze.start', client, eventEmitter);
      echo('analyze.stop', client, eventEmitter);
      echo('shutdown.start', client, eventEmitter);
      echo('shutdown.stop', client, eventEmitter);
      echo('emergencyshutdown', client, eventEmitter);
      echo('setdate', client, eventEmitter);
      echo('settime', client, eventEmitter);
      echo('clearerror', client, eventEmitter);

      echo('simleak', client, eventEmitter);
      echo('simstall', client, eventEmitter);
      echo('siminterlocksync', client, eventEmitter);
    });
    httpServer.listen(control.port);

    eventEmitter.all((event, args) => {
      // TODO: we should be stringifying everything on the way out
      if (event === 'laser') {
        emit(event, JSON.stringify(args));
      } else {
        emit(event, args);
      }
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
