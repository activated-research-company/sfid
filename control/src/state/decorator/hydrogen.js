const decorate = (state) => {
  state.register('hydrogen');
  return state;
};

module.exports = (container) => {
  container.decorator('state', decorate);
};
