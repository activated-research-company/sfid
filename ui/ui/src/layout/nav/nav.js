function nav(m, eventEmitter) {
  function component() {
    let currentPage = 'simple-control';

    function getTab(label, icon, route) {
      return m(`x-tab${currentPage === route ? '[selected]' : ''}`, {
        onclick: () => {
          if (!currentPage !== route) { eventEmitter.emit('route', route); }
        },
      },
      m('x-box', [
        icon ? m('x-icon.pr3.pl3', { name: `${icon}` }) : null,
        label ? m('x-label', `${label}`) : null,
      ]));
    }

    return {
      view: () => m('x-tabs.z-0.ma-aa', [
        getTab('', 'home', 'simple-control'),
        getTab('', 'edit', 'advanced-control'),
        getTab('', 'build', 'environment-monitor'),
        getTab('', 'view-list', 'log'),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('nav', nav, 'm', 'eventEmitter');
};
