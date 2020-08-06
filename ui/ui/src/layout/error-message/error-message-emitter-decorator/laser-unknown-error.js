function getDecorator(errorMessageFactory) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Laser Unknown Error';
    const content = `
      The laser encountered an unknown error.
      Please try again.
    `;

    const onLaserUnknownError = () => true;

    function getErrorMessage() {
      return errorMessageFactory.getNewErrorMessage(title, content);
    }

    decoratedEmitter.addHandler('laser.unknownerror', onLaserUnknownError, getErrorMessage);

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
