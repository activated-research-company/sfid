function fidPanel(m, systemState, labelledCard, stateDisplay) {
  function component() {
    return {
      view: () => m(labelledCard, { label: 'FID', state: systemState.fidFlame }, [
        m('.flex.pb2', [
          m('.w-50.pr1', m(stateDisplay, { state: systemState.hydrogen, hideSecondary: true })),
          m('.w-50.pl1', m(stateDisplay, { state: systemState.air, hideSecondary: true })),
        ]),
        m('.flex', [
          m('.w-50.pr1', m(stateDisplay, { state: systemState.fidTemperature })),
          m('.w-50.pl1.ma-aa', m(stateDisplay, { state: systemState.fid }))
        ]),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'simpleFidPanel',
    fidPanel,
    'm',
    'systemState',
    'labelledCard',
    'stateDisplay',
  );
};
