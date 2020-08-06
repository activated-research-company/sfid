function getDecorator(errorMessageFactory) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Stepper Stall';
    const content = `
      The stepper motor has stalled and the laser has been turned off.
    `;

    const onStall = () => true;

    function getErrorMessage() {
      return errorMessageFactory.getNewErrorMessage(title, content);
    }

    decoratedEmitter.addHandler('stall', onStall, getErrorMessage);

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
