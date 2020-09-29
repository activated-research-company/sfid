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
        m('.flex', [
          m('.w-100.ma-aa.pr1', [
            m('.w-100.tc.pb1', m(modeDisplay)),
            m('.w-100.tc.i', m(modeStepDisplay)),
          ]),
          m('.w-100.pl1', [
            m('.w-100.ma-aa.pb2', m(modeButton, { mode: 'analyze', label: 'Run', icon: 'play-arrow' })),
            m('.w-100.', m(modeButton, { mode: 'shutdown', label: 'Shutdown', icon: 'power-settings-new' })),
          ]),
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
