require('./link-panel.css');

function linkPanel(m, env, systemState, labelledCard, link) {
  const getLink = (url, label) => m(link, { url, label, disabled: !env.isWeb });

  function getComponent() {
    return {
      view: () => m('.bt.bb', m(labelledCard, { label: 'Links', state: systemState.online }, [
        env.isWeb ? null : m('.pb2', `Navigate to ${systemState.computerIp} in your browser to access these links.`),
        m('.pb2', getLink(env.dataUrl, 'Data')),
        m('.pb2', getLink(env.logUrl, 'System Logs')),
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
