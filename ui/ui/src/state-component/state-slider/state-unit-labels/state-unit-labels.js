function stateUnitLabels(m) {
  function component() {
    function getUnitLabel(unit) {
      return m('x-label.lh-20', unit);
    }

    function getUnitLabels(state, hideSecondary) {
      const units = [];
      if (state.units) { units.push(getUnitLabel(state.units)); }
      if (!hideSecondary && state.secondary) { units.push(getUnitLabel(state.secondary.units)); }
      return m('div.tl.monospace.f7', units);
    }

    return {
      view: ({ attrs: { state, hideSecondary } }) => getUnitLabels(state, hideSecondary),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('stateUnitLabels', stateUnitLabels, 'm');
};
