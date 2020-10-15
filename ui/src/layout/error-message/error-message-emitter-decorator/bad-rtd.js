function getDecorator(errorMessageFactory) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Faulty RTD';

    const getContent = (identifier) => `
        The RTD in the ${identifier === 'fid' ? 'FID' : identifier} has faulted.
        Power to the ${identifier === 'fid' ? 'FID' : identifier} heater has been shut off.
    `;

    const onBadRtd = () => true;

    function getErrorMessage(identifier) {
      return errorMessageFactory.getNewErrorMessage(title, getContent(identifier));
    }

    decoratedEmitter.addHandler('badrtd', onBadRtd, getErrorMessage);

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
