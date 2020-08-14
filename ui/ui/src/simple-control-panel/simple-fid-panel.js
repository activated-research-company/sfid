function fidPanel(m, systemState, labelledCard, stateDisplay) {
  function component() {
    return {
      view: () => m(labelledCard, { label: 'FID', state: systemState.fidFlame }, [
        m('.pb2', m(stateDisplay, { state: systemState.fidHydrogen, hideSecondary: true })),
        m('.pb2', m(stateDisplay, { state: systemState.fidAir, hideSecondary: true })),
        m('.pb2', m(stateDisplay, { state: systemState.fidTemperature })),
        m('.pb2', m(stateDisplay, { state: systemState.fid })),
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
