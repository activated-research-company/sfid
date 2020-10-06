const NodePidController = require('node-pid-controller');

function getPidController() {
  return NodePidController;
}

module.exports = (container) => {
  container.service('PidController', getPidController);
};
