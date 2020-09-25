require('./advanced-control-panel.css');

function advancedControlPanel(
  m,
  eventEmitter,
  webSocket,
  systemState,
  advancedFidPanel,
  numpad,
) {
  function component() {
    let tuning = false;
    let emergencyShutDownEnabled = false;

    function disableEmergencyShutdown() {
      emergencyShutDownEnabled = false;
    }

    return {
      oninit: () => {
        webSocket.on('emergencyshutdown', disableEmergencyShutdown);
      },
      onremove: () => {
        webSocket.off('emergencyshutdown', disableEmergencyShutdown);
      },
      view: () => {
        const tuningState = Object.keys(systemState).find((state) => systemState[state] ? systemState[state].tuning : false);
        if (tuningState) {
          if (!tuning) {
            tuning = true;
            systemState.chartingEvent = systemState[tuningState].event;
            systemState.chartingGetter = () => systemState[tuningState].actual;
            systemState.chartingSetpoint = () => systemState[tuningState].deviceSetpoint;
            systemState.eventEmitter.emit('chart', {
              title: systemState[tuningState].chartTitle,
              units: systemState[tuningState].units,
              setpoint: systemState[tuningState].deviceSetpoint,
            });
          }
        } else {
          tuning = false;
        }
        return [
          tuningState ? null : m('.bb.bt', m(advancedFidPanel, { eventEmitter, systemState })),
          m(numpad),
        ];
      },
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'advancedControlPanel',
    advancedControlPanel,
    'm',
    'eventEmitter',
    'webSocket',
    'systemState',
    'advancedFidPanel',
    'numpad',
  );
};
