module.exports = (container) => {
  require('./state')(container);
  require('./decorator/air')(container);
  require('./decorator/fid')(container);
  require('./decorator/heater')(container);
  require('./decorator/hydrogen')(container);
  require('./state-emitter')(container);
};
