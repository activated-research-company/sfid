/* eslint-disable global-require */
module.exports = (container) => {
  require('./link')(container);
  require('./link-panel')(container);
};
