function getStateEmitter(state, eventEmitter) {
  const emitState = (state) => {
    eventEmitter.emit(state.type, state);
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
