const phidget22 = require('phidget22');

function getNewPhidget22() {
  return phidget22;
}

module.exports = (container) => {
  container.service('phidget', getNewPhidget22);
};
