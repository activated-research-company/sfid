require('./link-panel.css');

function linkPanel(m, env, systemState, labelledCard, link) {
  const getLink = (url, label) => m(link, { url, label, disabled: !env.isWeb });
  const getLinks = () => [
    m('.pb2', getLink(env.dataUrl, 'Data')),
    m('.pb2', getLink(env.logUrl, 'System Logs')),
    getLink(env.productUrl, 'Product Page'),
  ];

  function getComponent() {
    return {
      view: () => m('.bt.bb', m(labelledCard, { label: 'Links', state: systemState.online },
        env.isWeb
          ? getLinks()
          : m('.flex', [
            m('.w-50.ma-aa.pr3.pl2.tc', `Open a browser and navigate to ${systemState.computerIp.getDisplayValue() || 'this unit\'s IP address'} to access these links.`),
            m('.w-50.pl1', getLinks()),
          ]),
      )),
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
