function emergencyShutdownConfirm(m, eventEmitter, modal, button) {
  function getComponent() {
    let hide = true;

    function show() {
      hide = false;
    }

    return {
      oninit: () => {
        eventEmitter.on('confirmemergencyshutdown', show);
      },
      onremove: () => {
        eventEmitter.off('confirmemergencyshutdown', show);
      },
      view: () => m(modal, { hide }, [
        m('.pb2.tc', 'Please confirm emergency shutdown.'),
        m('.flex', [
          m('.pr2.w-50', m(button, {
            label: 'Yes',
            onclick: () => {
              eventEmitter.emit('emergencyshutdown');
              hide = true;
            },
          })),
          m('.pl2.w-50', m(button, {
            label: 'No',
            onclick: () => {
              hide = true;
            },
          })),
        ]),
      ]),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'emergencyShutdownConfirm',
    emergencyShutdownConfirm,
    'm',
    'eventEmitter',
    'modal',
    'button',
  );
};
