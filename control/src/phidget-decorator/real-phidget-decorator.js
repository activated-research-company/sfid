function realPhidgetDecorator(logger, eventEmitter) {
  return {
    decorate: (phidget, identifier) => {
      const decoratedPhidget = phidget;
      decoratedPhidget.onError = (code, description) => {
        if (!phidget.getAttached()) { return; }

        logger.error(`Phidget ${phidget.name} (${identifier}) Error ${code}: ${description}`);

        // TODO: put this in a separate decorator or something like that
        if (phidget.name === 'TemperatureSensor' && code === 4105) {

          const reconnect = () => {
            phidget.open();
            eventEmitter.off('clearerror', reconnect);
          };

          eventEmitter.emit('badrtd', identifier);
          eventEmitter.emit(`set${identifier}temperature`, 0);
          eventEmitter.on('clearerror', reconnect);
          phidget.close();
        }
      };
    },
  };
};

module.exports = (container) => {
  container.service(
    'realPhidgetDecorator',
    realPhidgetDecorator,
    'logger',
    'eventEmitter',
  );
};
