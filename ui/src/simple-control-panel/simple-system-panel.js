function simpleSystemPanel(
  m,
  systemState,
  labelledCard,
  modeButton,
  modeDisplay,
  modeStepDisplay,
) {
  function component() {
    return {
      view: () => m(labelledCard, { label: 'Sys', state: systemState.online }, [
        m('.flex.pb2', [
          m('.w-100.pr1.tc', m(modeDisplay)),
          m('.w-100.pl1.ma-aa', m(modeButton, { mode: 'analyze', label: 'Run', icon: 'play-arrow' })),
        ]),
        m('.flex', [
          m('.w-100.pr1.tc.ma-aa', m(modeStepDisplay)),
          m('.w-100.pl1', m(modeButton, { mode: 'shutdown', label: 'Shutdown', icon: 'power-settings-new' })),
        ]),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'simpleSystemPanel',
    simpleSystemPanel,
    'm',
    'systemState',
    'labelledCard',
    'modeButton',
    'modeDisplay',
    'modeStepDisplay',
    'emergencyShutdownButton',
    'emergencyShutdownConfirm',
  );
};
