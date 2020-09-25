const winston = require('winston');

function getWinston() {
  return winston;
}

module.exports = (container) => {
  container.service('winston', getWinston);
}