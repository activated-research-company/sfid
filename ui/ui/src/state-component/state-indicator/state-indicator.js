function stateIndicator(m, stateIcon, throbber) {
  function getComponent() {
    return {
      view: ({ attrs: { state }}) => m('x-box',
        m('.flex.ma-aa', [
          m('.pr1', state.isConnected && state.isConnected() ? m(stateIcon, { state }) : m(throbber)),
          m('.pl1.ma-aa', m('x-label', state.label)),
        ]),
      ),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service('stateIndicator', stateIndicator, 'm', 'stateIcon', 'throbber');
};
