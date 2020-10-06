const fs = require('fs');

function getFs() {
  return fs;
}

module.exports = (container) => {
  container.service('fs', getFs);
};
