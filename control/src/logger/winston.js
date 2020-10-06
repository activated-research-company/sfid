const winston = require('winston');
require('winston-daily-rotate-file');

function getWinston() {
  return winston;
}

module.exports = (container) => {
  container.service('winston', getWinston);
};
