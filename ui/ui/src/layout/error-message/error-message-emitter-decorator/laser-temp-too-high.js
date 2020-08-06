function getDecorator(errorMessageFactory) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Laser Temp Too High';
    const content = `
      The laser has overheated.
      This is likely due to operating at too high power.
      Please use less power or run the laser for a shorter duration.
    `;

    const onLaserInterlockSync = () => true;

    function getErrorMessage() {
      return errorMessageFactory.getNewErrorMessage(title, content);
    }

    decoratedEmitter.addHandler('laser.temptoohigh', onLaserInterlockSync, getErrorMessage);

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
