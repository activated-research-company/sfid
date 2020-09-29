const decorate = (state) => {
  state.register('heater');
  return state;
};

module.exports = (container) => {
  container.decorator('state', decorate);
};
