const { Subject } = require('rxjs');

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
    subjects[type.toLowerCase()].next({ type: type.toLowerCase(), ...payload });
  },
}

function getState() { return state; }

module.exports = (container) => {
  container.service('state', getState);
};
