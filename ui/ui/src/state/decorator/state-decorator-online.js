const isOnline = require('is-online');

function getDecorator() {
  function decorate(systemState) {
    const decoratedSystemState = systemState;

    let online = false;

    function checkIfIsOnline() {
      isOnline().then((args) => {
        online = args;
      });
    }

    setInterval(checkIfIsOnline, 10000);

    decoratedSystemState.online = {
      getActual: () => online,
    };

    return decoratedSystemState;
  }

  return decorate;
}

module.exports = (container) => {
  container.decorator(
    'systemState',
    getDecorator(container.container.isOnline),
  );
};
