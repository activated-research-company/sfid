const moment = require('moment-timezone'); // TODO: try dayjs

function getMoment() {
  return moment;
}

module.exports = (container) => {
  container.service('moment', getMoment);
};
