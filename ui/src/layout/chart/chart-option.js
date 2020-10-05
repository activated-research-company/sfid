function chartOption(m) {
  function component() {
    return {
      view: ({ attrs }) => m('x-menuitem', {
        onclick: attrs.state.chart,
      }, m('x-label', `${attrs.state.chartTitle}`)),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('chartOption', chartOption, 'm');
};
