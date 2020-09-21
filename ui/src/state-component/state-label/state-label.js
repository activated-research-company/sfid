function stateLabel(m) {
  function component() {
    return {
      view: ({ attrs: { state } }) => m('x-label.tc.dark-blue', state.label),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('stateLabel', stateLabel, 'm');
};
