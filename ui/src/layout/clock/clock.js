function clockFactory(m, time, eventEmitter) {
  function getComponent() {
    function onclick() { eventEmitter.emit('changeclock'); }

    return {
      view: () => m('.', { onclick }, time.now().format('h:mm A')),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service('clock', clockFactory, 'm', 'time', 'eventEmitter');
};
