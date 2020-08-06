module.exports = (container) => {
  if (container.container.env.phidget.useSim) {
    container.constant('phidgetDecorator', container.container.mockPhidgetDecorator);
  } else {
    container.constant('phidgetDecorator', container.container.realPhidgetDecorator);
  }
};
