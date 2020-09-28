require('./environment-monitor.css');

function environmentMonitor(m, systemState, labelledCard, stateDisplay, stateIcon, env) {
  function component() {
    return {
      view: () => m('.ma-aa', [
        m('.tc.pb2', `Device ID: ${env.uuid}`),
        m('.bb.bt', [
          m(labelledCard, { label: 'Comp', state: systemState.online }, [
            m('.flex.pb2', [
              m('.w-50.pr1', m(stateDisplay, { state: systemState.computerIp })),
              m('.flex.pl1.ma-aa', [
                m(stateIcon, { state: systemState.redLight }),
                m(stateIcon, { state: systemState.orangeLight }),
                m(stateIcon, { state: systemState.greenLight }),
              ]),
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
    'stateIcon',
    'env',
  );
};
