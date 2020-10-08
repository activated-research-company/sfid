function getStateEmitter(state, eventEmitter) {
  const emitState = (args) => {
    eventEmitter.emit(args.type, args);
  };

  state.subscribe({ next: emitState });

  return {};
}

module.exports = (container) => {
  container.service(
    'stateEmitter',
    getStateEmitter,
    'state',
    'eventEmitter',
  );
};
