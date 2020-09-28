require('./simple-control-panel.css');

function simpleControlPanel(
  m,
  simpleFidPanel,
  simpleSystemPanel,
) {
  function component() {
    return {
      view: () => m('.bt.bb.flex', [
        m(simpleFidPanel),
        m(simpleSystemPanel),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'simpleControlPanel',
    simpleControlPanel,
    'm',
    'simpleFidPanel',
    'simpleSystemPanel',
  );
};
