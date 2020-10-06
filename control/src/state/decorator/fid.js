const decorate = (state) => {
  state.register('fid');
  return state;
};

module.exports = (container) => {
  container.decorator('state', decorate);
};
