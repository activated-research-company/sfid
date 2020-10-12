function linkPanel(m, env, systemState, labelledCard, link) {
  const getLink = (url, label) => m('.pb2', m('.pb2', m(link, { url, label })));

  function getComponent() {
    return {
      view: () => m('.bt.bb', m(labelledCard, { label: 'Links', state: systemState.online }, [
        getLink(env.dataUrl, 'Data'),
        getLink(env.logUrl, 'System Logs'),
        getLink(env.productUrl, 'Product Page'),
      ])),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'linkPanel',
    linkPanel,
    'm',
    'env',
    'systemState',
    'labelledCard',
    'link',
  );
};
