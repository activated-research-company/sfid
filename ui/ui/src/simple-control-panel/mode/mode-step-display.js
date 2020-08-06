function modeStepDisplay(m, eventEmitter) {
  function getComponent() {
    let mode = {
      step: '',
      secondaryStep: '',
    };

    function onMode(newMode) { mode = newMode; }

    return {
      oninit: () => {
        eventEmitter.on('mode', onMode);
      },
      onremove: () => {
        eventEmitter.off('mode', onMode);
      },
      view: () => m('.f7', [
        m('x-label', mode.step),
        m('x-label', mode.secondaryStep),
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
