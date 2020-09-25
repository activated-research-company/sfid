require('./labelled-card.css');

function labelledCard(m, stateIcon) {
  function component() {
    return {
      view: ({ attrs: { label, state }, children }) => m('.w-100',
        [
          m('.flex', [
            m(`.w-5.bg-dark.text-light.vertical.f4.tc.b.${state ? '.flex' : ''}`, [
              state ? m('.h-25') : null,
              m(`.${state ? 'h-50' : ''}`, label),
              state ? m('.rotate-180.ma-aa', m(stateIcon, { state })) : null,
            ]),
            m('.pa2.w-100.ma-aa', children),
          ]),
        ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('labelledCard', labelledCard, 'm', 'stateIcon');
};
