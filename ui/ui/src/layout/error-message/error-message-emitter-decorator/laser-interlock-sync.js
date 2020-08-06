function getDecorator(errorMessageFactory, systemState) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Laser Interlock Sync';
    const content = `The laser interlocks are out of sync.
      This is likely due to closing the cell compartment door incorrectly.
      Please open the door and close it again, making sure it slides into place smoothly with each side of the door making contact at the same time.`;

    const getContent = () => [
      content,
      `The left interlock is ${systemState.laserInterlock1.actual ? 'not' : ''} defeated.`,
      `The right interlock is ${systemState.laserInterlock2.actual ? 'not' : ''} defeated.`,
    ];

    const onLaserInterlockSync = () => true;

    function getErrorMessage() {
      return errorMessageFactory.getNewErrorMessage(title, getContent());
    }

    decoratedEmitter.addHandler('laser.interlocksync', onLaserInterlockSync, getErrorMessage);

    return decoratedEmitter;
  }

  return decorate;
}

module.exports = (container) => {
  container.decorator(
    'errorMessageEmitter',
    getDecorator(
      container.container.errorMessageFactory,
      container.container.systemState,
    ),
  );
};
