require('./state-slider.css');

function stateSlider(m, stateButton, stateSetpointLabels, stateActualLabels, stateUnitLabels) {
  // TODO: change the name of this thing
  function component() {
    return {
      view: ({ attrs: { eventEmitter, state } }) => m('.flex', [
        m('.w-50.lh-30', [
          m('.pb1', m(stateButton, { eventEmitter, state })),
          m('.tc.f7', m(stateSetpointLabels, { state })),
        ]),
        m('.w-50.ma-aa', [
          m('.w-100.flex', [
            m('.w-30.ma-aa.b', m(stateActualLabels, { state })),
            m('.w-20.ma-aa', m(stateUnitLabels, { state })),
          ]),
        ]),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('stateSlider', stateSlider, 'm', 'stateButton', 'stateSetpointLabels', 'stateActualLabels', 'stateUnitLabels');
};
