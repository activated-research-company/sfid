function emergencyShutdownButton(m, eventEmitter, button) {
  function component() {
    return {
      view: () => m('.w-100', m(button, {
        label: 'Emergency Shutdown',
        icon: 'warning',
        color: 'dark-red',
        onclick: () => {
          eventEmitter.emit('confirmemergencyshutdown');
        },
      })),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('emergencyShutdownButton', emergencyShutdownButton, 'm', 'eventEmitter', 'button');
};
