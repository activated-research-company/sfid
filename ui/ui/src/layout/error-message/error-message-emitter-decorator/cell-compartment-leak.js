function getDecorator(errorMessageFactory) {
  function decorate(emitter) {
    const decoratedEmitter = emitter;
    const title = 'Leak Detected';
    const content = `
      A leak has been detected in the cell compartment.
      Liquid flow has been diverted and the laser and hydrogen flow to the FID have both been shut off.
      Please fix the leak before continuing.
    `;

    function onCellCompartmentLeak(isLeaking) {
      return isLeaking;
    }

    function getErrorMessage() {
      return errorMessageFactory.getNewErrorMessage(title, content);
    }

    decoratedEmitter.addHandler('cellcompartment.leak', onCellCompartmentLeak, getErrorMessage);

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
