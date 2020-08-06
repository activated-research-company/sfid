/* eslint-disable global-require */
function register(bottle) {
  require('./diversion-valve')(bottle);
}

module.exports = register;
