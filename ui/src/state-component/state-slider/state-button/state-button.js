function stateButton(m, eventEmitter, button, stateLabel) {
  function component() {
    return {
      view: ({ attrs: { state } }) => m(button, { onclick: () => { eventEmitter.emit('editstate', state); } }, m(stateLabel, { state })),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('stateButton', stateButton, 'm', 'eventEmitter', 'button', 'stateLabel');
};
