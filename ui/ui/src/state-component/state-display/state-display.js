function stateDisplay(m, stateLabel, stateSetpointLabels, stateUnitLabels, stateActualLabels) {
  function component() {
    return {
      view: ({ attrs: { state, hideSecondary } }) => m('.flex', [
        m('.w-45.lh-30', [
          m('.pb1', m(stateLabel, { state })),
          state.setpoint ? m('.pb1.tc.f7', m(stateSetpointLabels, { state })) : null,
        ]),
        m('.w-50.ma-aa', [
          m('.w-100.flex', [
            m('.w-30.ma-aa.b', m(stateActualLabels, { state, hideSecondary })),
            m('.w-20.ma-aa', m(stateUnitLabels, { state, hideSecondary })),
          ]),
        ]),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('stateDisplay', stateDisplay, 'm', 'stateLabel', 'stateSetpointLabels', 'stateUnitLabels', 'stateActualLabels');
};
