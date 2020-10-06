function realPhidgetDecorator(logger) {
  return {
    decorate: (phidget, identifier) => {
      const decoratedPhidget = phidget;
      decoratedPhidget.onError = (code, description) => {
        logger.error(`Phidget ${phidget.name} (${identifier}) Error ${code}: ${description}`);
      };
    },
  };
};

module.exports = (container) => {
  container.service(
    'realPhidgetDecorator',
    realPhidgetDecorator,
    'logger',
  );
};
