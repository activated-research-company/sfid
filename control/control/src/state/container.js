module.exports = (container) => {
  require('./state')(container);
  require('./state-emitter')(container);
};
