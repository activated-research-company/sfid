function environmentMonitor(m, systemState, labelledCard, stateDisplay, simButton, stateIcon) {
  function component() {
    return {
      view: () => m('.ma-aa', [
        m('.bb.bt', [
          m(labelledCard, { label: 'Comp' }, [
            m('.flex.pb2', [
              m('.w-50.pr1', m(stateDisplay, { state: systemState.computerIp })),
            ]),
            m('.flex.pb2', [
              m('.w-50.pr1', m(stateDisplay, { state: systemState.computerCpu })),
              m('.w-50.pl1', m(stateDisplay, { state: systemState.computerMemory })),
            ]),
            m('.flex.pb2', [
              m('.w-50.pr1', m(stateDisplay, { state: systemState.computerUptime })),
              m('.w-50.pl1', m(stateDisplay, { state: systemState.computerTemperature })),
            ]),
            m('.flex', [
              m('.w-50.pr1', m(stateDisplay, { state: systemState.computerFsSize })),
              m('.w-50.pl1', m(stateDisplay, { state: systemState.computerFsUsed })),
            ]),
          ]),
        ]),
        m('.bb', [
          m(labelledCard, { label: 'Sim' }, [
            m('.tc.pb2', 'Use these buttons to simulate a system event.'),
            m('.flex.pb2', [
              m('.w-50.pr1', m(simButton, { label: 'Leak', event: 'simleak' })),
              m('.w-50.pl1', m(simButton, { label: 'Stepper Stall', event: 'simstall' })),
            ]),
            m('.flex', [
              m('.w-50.pr1', m(simButton, { label: 'Laser Interlock Desync', event: 'siminterlocksync' })),
            ]),
          ]),
        ]),
        m('.flex.pr2.pt2', [
          m(stateIcon, { state: systemState.redLight }),
          m(stateIcon, { state: systemState.orangeLight }),
          m(stateIcon, { state: systemState.greenLight }),
        ]),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'environmentMonitor',
    environmentMonitor,
    'm',
    'systemState',
    'labelledCard',
    'stateDisplay',
    'simButton',
    'stateIcon',
  );
};
