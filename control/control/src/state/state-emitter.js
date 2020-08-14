function getStateEmitter(state, eventEmitter) {
  const emitState = (state) => {
    eventEmitter.emit(state.type, state[state.type]);
  };
  
  state.subscribe(emitState);
}

module.exports = (container) => {
  container.service(
    'stateEmitter',
    getStateEmitter,
    'state',
    'eventEmitter',
  );
};
