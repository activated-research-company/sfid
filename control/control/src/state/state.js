const { Subject } = require('rxjs');
const subject = new Subject();

let s = {};

const state = {
  subscribe: (args) => subject.subscribe(args),
  next: ({ type, payload }) => {
    s = { ...s, [type.toLowerCase()]: { ...s[type.toLowerCase()], ...payload}};
    subject.next(s);
  },
}

module.exports = (container) => {
  container.constant('state', state);
};
