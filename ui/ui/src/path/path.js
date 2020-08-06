const path = require('path');

function getPath() {
  return path;
}

module.exports = (container) => {
  container.service('path', getPath);
};
