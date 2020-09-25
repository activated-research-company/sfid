require('./simple-control-panel.css');

function simpleControlPanel(
  m,
  simpleFidPanel,
  simpleSystemPanel,
) {
  function component() {
    return {
      view: () => m('.ma-aa', [
        m('.bb.bt', m(simpleFidPanel)),
        m('.bb', m(simpleSystemPanel)),
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
