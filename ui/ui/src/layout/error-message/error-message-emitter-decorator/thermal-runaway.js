function getDecorator(errorMessageFactory) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Thermal Runaway';

    const getContent = (identifier) => `
        Thermal runaway has been detected in the ${identifier === 'fid' ? 'FID' : identifier}.
        Please power down the unit and invesitgate the issue before starting again.
    `;

    const onThermalRunaway = () => true;

    function getErrorMessage(identifier) {
      return errorMessageFactory.getNewErrorMessage(title, getContent(identifier));
    }

    decoratedEmitter.addHandler('thermalrunaway', onThermalRunaway, getErrorMessage);

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
