function decorate(eventEmitter) {
  const decoratedEventEmitter = eventEmitter;
  const { emit } = decoratedEventEmitter;

  decoratedEventEmitter.all = (listener) => {
    decoratedEventEmitter.onAll = listener;
  };

  const reachedSetpointDeviations = {
    cellpressure: 0.05,
  };

  function addReachedSetpointToArgs(event, args) {
    if (args && Object.prototype.hasOwnProperty.call(args, 'setpoint')) {
      const argsToDecorate = args;
      const deviation = reachedSetpointDeviations[event] || 0.01;
      const min = args.setpoint - (args.setpoint * deviation);
      const max = args.setpoint + (args.setpoint * deviation);
      argsToDecorate.reachedSetpoint = !args.setpoint || (min <= args.actual && args.actual <= max);
    }
  }

  function emitWithAll(event, args) {
    addReachedSetpointToArgs(event, args); // TODO: break this into a separate decorator
    if (this.onAll) { this.onAll(event, args); }
    this.oldEmit(event, args);
    return this;
  }

  decoratedEventEmitter.emit = emitWithAll;
  decoratedEventEmitter.oldEmit = emit;

  return decoratedEventEmitter;
}

module.exports = (container) => {
  container.decorator('eventEmitter', decorate);
};
