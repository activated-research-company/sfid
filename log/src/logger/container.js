/* eslint-disable global-require */
module.exports = (container) => {
  require('./winston')(container);
  require('./logger-factory')(container);
  require('./transport/console-transport-factory')(container);
  require('./transport/file-transport-factory')(container);
  require('./control-logger')(container);
  require('./ui-logger')(container);
  require('./log-logger')(container);
};
