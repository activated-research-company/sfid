require('./nav.css');

function nav(m, eventEmitter) {
  function component() {
    let currentPage = 'simple-control';

    function getTab(label, icon, route) {
      return m(`x-tab${currentPage === route ? '[selected]' : ''}`, {
        onclick: () => {
          if (!currentPage !== route) {
            currentPage = route;
            eventEmitter.emit('route', route);
          }
        },
      },
      m('x-box', [
        icon ? m('x-icon.pr3.pl3', { name: `${icon}` }) : null,
        label ? m('x-label', `${label}`) : null,
      ]));
    }

    return {
      view: () => m('x-tabs.z-0.ma-aa', [
        getTab('', 'home', 'simple'),
        getTab('', 'edit', 'advanced'),
        getTab('', 'build', 'computer'),
        getTab('', 'view-list', 'links'),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('nav', nav, 'm', 'eventEmitter');
};
