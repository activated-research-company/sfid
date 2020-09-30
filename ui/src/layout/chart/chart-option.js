function chartOption(m, env) {
  function component() {
    return {
      view: ({ attrs }) => m(`x-menuitem${env.isWeb || env.isDev ? '' : '.cursor-none'}`, {
        onclick: attrs.state.chart,
      }, m('x-label', `${attrs.state.chartTitle}`)),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('chartOption', chartOption, 'm', 'env');
};
