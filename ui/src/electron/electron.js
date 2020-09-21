const electron = require('electron');

function getElectron() {
  return electron;
}

module.exports = (container) => {
  container.service('electron', getElectron);
};
