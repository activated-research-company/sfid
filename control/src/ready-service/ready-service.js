function readyService(env, eventEmitter, logger) {
  const events = [];
  let interval;

  function addEvent(name) {
    events.push({
      name,
      event: `${name.replace(/ /g, '')}found`,
      ready: false,
    });
    return this;
  }

  function listen() {
    if (env.fid.isAttached) { addEvent('fid'); }
    if (env.fc.isAttached) { addEvent('alicat hub'); }

    events.forEach((event) => {
      eventEmitter.on(event.event, () => {
        logger.info(`${event.name} located`);
        event.ready = true;
        eventEmitter.emit('ready.progress');
      });
    });
    interval = setInterval(() => {
      let systemIsReady = true;
      events.forEach((event) => {
        if (!event.ready) { systemIsReady = false; }
      });
      if (systemIsReady) {
        logger.info('system is ready');
        eventEmitter.emit('ready.complete');
        eventEmitter.emit('ready');
        clearInterval(interval);
      }
    }, 1000);

    eventEmitter.emit('ready.started', events.length);
  }

  return {
    addEvent,
    listen,
  };
}

module.exports = (container) => {
  container.service('readyService', readyService, 'env', 'eventEmitter', 'logger');
};
