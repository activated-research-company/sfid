function stateIcon(m) {
  function getComponent() {
    function getIcon(state) {
      const color = state.getActual() ? state.icon.onColor : state.icon.offColor;
      const name = state.getActual() ? state.icon.on : state.icon.off;
      // TODO: make iconset selection smarter or make everything custom since we don't use that many
      return m(`x-icon${name === 'waves' ? '[iconset=assets/custom-iconset.svg]' : ''}.${color}`, { name });
    }

    return {
      view: ({ attrs: { state } }) => getIcon(state),
    };
  }

  return getComponent();
}

module.exports = (container) => {
  container.service('stateIcon', stateIcon, 'm');
};
