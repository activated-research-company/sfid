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
      view: () => m(labelledCard, { label: 'System', state: systemState.online }, [
          m('.w-100.pb2.tc', m(modeDisplay)),
          m('.w-100.pb3.tc.ma-aa', m(modeStepDisplay)),
          m('.w-100.pb3', m(modeButton, { mode: 'standby', label: 'Standby', icon: 'loop' })),
          m('.w-100.pb3', m(modeButton, { mode: 'analyze', label: 'Run', icon: 'play-arrow' })),
          m('.w-100.pb', m(modeButton, { mode: 'shutdown', label: 'Shutdown', icon: 'power-settings-new' })),
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
