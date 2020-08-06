function getDecorator(errorMessageFactory) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Unresponsive RTD';

    const getContent = (identifier) => `
        The ${identifier === 'fid' ? 'FID' : identifier} RTD is unresponsive to heating.
        Power to the ${identifier === 'fid' ? 'FID' : identifier} heater has been shut off.
    `;

    const onThermalRunaway = () => true;

    function getErrorMessage(identifier) {
      return errorMessageFactory.getNewErrorMessage(title, getContent(identifier));
    }

    decoratedEmitter.addHandler('unresponsivethermometer', onThermalRunaway, getErrorMessage);

    return decoratedEmitter;
  }

  return decorate;
}

module.exports = (container) => {
  container.decorator(
    'errorMessageEmitter',
    getDecorator(container.container.errorMessageFactory),
  );
};
