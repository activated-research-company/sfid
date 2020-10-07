const { Subject } = require('rxjs');

function getState(logger) {
  
const subjects = {};

const state = {
  register: (type) => {
    subjects[type.toLowerCase()] = new Subject();
  },
  subscribe: ({ type, next }) => {
    if (type) {
      subjects[type.toLowerCase()].subscribe(next);
    } else {
      Object.keys(subjects).forEach((key) => {
        subjects[key].subscribe(next);
      });
    }
  },
  next: ({ type, payload }) => {
    if (!type) {
      logger.error(`received falsy type [${type}] w/ ${JSON.stringify(payload)}`);
    } else {
      subjects[type.toLowerCase()].next({ type: type.toLowerCase(), ...payload });
    }
  },
}

  return state;
}

module.exports = (container) => {
  container.service('state', getState, 'logger');
};
