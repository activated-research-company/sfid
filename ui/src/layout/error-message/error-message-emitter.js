function getErrorMessageEmitter(webSocket, eventEmitter) {
  function emitErrorMessage(message) {
    eventEmitter.emit('errormessage', message);
  }

  function evaluateEventArgs(args, shouldEmitErrorMessage, getErrorMessage) {
    if (shouldEmitErrorMessage(args)) { emitErrorMessage(getErrorMessage(args)); }
  }

  function addHandler(event, shouldEmitErrorMessage, getErrorMessage) {
    webSocket.on(event, (args) => {
      evaluateEventArgs(args, shouldEmitErrorMessage, getErrorMessage);
    });
  }

  return {
    addHandler,
  };
}

module.exports = (container) => {
  container.service('errorMessageEmitter', getErrorMessageEmitter, 'webSocket', 'eventEmitter');
};
