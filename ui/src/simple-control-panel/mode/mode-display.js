function modeDisplay(m, webSocket, eventEmitter, systemState) {
  function getComponent() {
    let mode = {
      current: '',
      inProcess: '',
      progress: 0,
    };

    function onMode(newmode) {
      mode = newmode;
    }

    function modeIsInProcess() {
      return mode.inProcess !== '';
    }
    function getLabel() {
      if (!webSocket.isConnected()) { return 'System is disconnected'; }
      if (modeIsInProcess()) {
        switch (mode.inProcess) {
          case 'components':
            return 'Components starting up';
          case 'ready':
            return 'Components initializing';
          case 'standby':
            return 'Going into standby';
          case 'analyze':
            return 'Getting ready to run';
          case 'shutdown':
            return 'Shutting down';
          default:
            return '';
        }
      } else {
        switch (mode.current) {
          case '':
          case 'components':
          case 'ready':
            return 'System is idle';
          case 'standby':
            return 'Standing by';
          case 'analyze':
            if (!systemState.diversionValve.actual) { return 'Ready for liquid'; }
            return 'Running';
          case 'shutdown':
            return 'System is idle';
          default:
            return '';
        }
      }
    }

    return {
      oninit: () => {
        eventEmitter.on('mode', onMode);
      },
      onremove: () => {
        eventEmitter.off('mode', onMode);
      },
      view: () => m('.', [
        m('x-label.pb1', getLabel()),
        m('x-progressbar', webSocket.isConnected() ? { value: mode.progress } : null),
      ]),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'modeDisplay',
    modeDisplay,
    'm',
    'webSocket',
    'eventEmitter',
    'systemState',
  );
};
