function advancedFidPanel(
  m,
  systemState,
  labelledCard,
  stateSlider,
  stateSwitch,
  stateDisplay,
) {
  function component() {
    return {
      view: () => m(labelledCard, { label: 'FID', state: systemState.fidFlame }, [
        m('.flex.pb2', [
          m('.w-50.pr1', m(stateSlider, { state: systemState.fidHydrogen })),
          m('.w-50.pl1', m(stateSlider, { state: systemState.fidAir })),
        ]),
        m('.flex.pb2', [
          m('.w-50.pr1', m(stateSlider, { state: systemState.fidTemperature })),
          m('.w-50.pl1.ma-aa', m(stateDisplay, { state: systemState.fid })),
        ]),
        m('.flex', [
          m('.w-50.pr1', m(stateSwitch, { state: systemState.fidIgniter })),
          m('.w-50.pl1.ma-aa', m(stateDisplay, { state: systemState.fidFlameTemperature })),
        ]),
      ]),
    };
  }

  return component();
}

module.exports = (container) => {
  container.service(
    'advancedFidPanel',
    advancedFidPanel,
    'm',
    'systemState',
    'labelledCard',
    'stateSlider',
    'stateSwitch',
    'stateDisplay',
  );
};
