function modeStepDisplay(m, eventEmitter) {
  function getComponent() {
    let mode = {
      step: '',
    };

    function onMode(newMode) { mode = newMode; }

    return {
      oninit: () => {
        eventEmitter.on('mode', onMode);
      },
      onremove: () => {
        eventEmitter.off('mode', onMode);
      },
      view: () => m('.', [
        m('x-label', mode.step),
      ]),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'modeStepDisplay',
    modeStepDisplay,
    'm',
    'eventEmitter',
  );
};
