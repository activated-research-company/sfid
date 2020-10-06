const events = require('events');

function eventEmitter() {
  return new events.EventEmitter().setMaxListeners(25);
}

module.exports = (container) => {
  container.service('eventEmitter', eventEmitter);
};
