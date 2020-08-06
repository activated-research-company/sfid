const {
  webSocket,
  settings,
  eventEmitter,
  errorMessageEmitter, // TODO: bootstrap services on startup that aren't explicitly used here
  m,
  layout,
  simpleControlPanel,
  advancedControlPanel,
  environmentMonitor,
  logPanel,
  logger,
} = require('./container');

logger.info('initizializing');

if (!webSocket.isConnected()) { webSocket.connect(); }

setInterval(m.redraw, 250); // this is much more efficient than actively redrawing on state updates

function solvere() {
  let route = 'simple-control';

  function getComponent() {
    switch (route) {
      case 'simple-control':
        return simpleControlPanel;
      case 'advanced-control':
        return advancedControlPanel;
      case 'environment-monitor':
        return environmentMonitor;
      case 'log':
        return logPanel;
      default:
        return null;
    }
  }

  function onRoute(newRoute) { route = newRoute; }

  return {
    oninit: () => {
      eventEmitter.on('route', onRoute);
    },
    onRemove: () => {
      eventEmitter.off('route', onRoute);
    },
    view: () => m(layout, { route, hideChart: route === 'log' }, m(getComponent())),
  };
}

settings.load().then(() => {
  // eslint-disable-next-line no-undef
  m.mount(document.body, solvere);
});
