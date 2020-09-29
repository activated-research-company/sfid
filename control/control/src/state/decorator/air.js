const decorate = (state) => {
  state.register('air');
  return state;
};

module.exports = (container) => {
  container.decorator('state', decorate);
};
