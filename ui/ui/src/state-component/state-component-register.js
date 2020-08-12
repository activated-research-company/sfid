/* eslint-disable global-require */
function registerStateComponents(container) {
  require('./state-icon/state-icon')(container);
  require('./state-icon/decorator/fid-flame')(container);
  require('./state-icon/decorator/fid-igniter')(container);
  require('./state-icon/decorator/red-light')(container);
  require('./state-icon/decorator/orange-light')(container);
  require('./state-icon/decorator/green-light')(container);
  require('./state-icon/decorator/online')(container);

  require('./state-indicator/state-indicator')(container);

  require('./state-slider/state-slider')(container);
  require('./state-slider/state-actual-labels/state-actual-labels')(container);
  require('./state-slider/state-button/state-button')(container);
  require('./state-slider/state-setpoint-labels/state-setpoint-labels')(container);
  require('./state-slider/state-unit-labels/state-unit-labels')(container);

  require('./state-display/state-display')(container);

  require('./state-label/state-label')(container);

  require('./state-switch/state-switch')(container);
  require('./state-switch/decorator/fid-igniter')(container);
}

module.exports = registerStateComponents;
