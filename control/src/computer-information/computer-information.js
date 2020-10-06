const systemInformation = require('systeminformation');

function computerInformation() {
  return systemInformation;
}

module.exports = (container) => {
  container.service('computerInformation', computerInformation);
};
