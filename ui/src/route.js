const {
  env,
  webSocket,
  settings,
  eventEmitter,
  errorMessageEmitter, // TODO: bootstrap services on startup that aren't explicitly used here
  m,
  layout,
  simpleControlPanel,
  advancedControlPanel,
  computerPanel,
  linkPanel,
  logger,
} = require('./container');

require('../node_modules/normalize.css/normalize.css');
require('../node_modules/tachyons/css/tachyons.min.css');
require('../node_modules/xel/xel.min.js');
require('../node_modules/xel/themes/vanilla.css');
require('./index.css');

logger.info('initizializing');

if (!webSocket.isConnected()) { webSocket.connect(); }

setInterval(m.redraw, 250); // this is much more efficient than actively redrawing on state updates

function sfid() {
  let route = 'simple';

  function getComponent() {
    switch (route) {
      case 'simple':
        return simpleControlPanel;
      case 'advanced':
        return advancedControlPanel;
      case 'computer':
        return computerPanel;
      case 'links':
        return linkPanel;
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
    view: () => m(`${env.isDev ? '.dev' : ''}${env.isWeb ? '.web' : '.electron'}`, m(layout, { route }, m(getComponent()))),
  };
}

// settings.load().then(() => {
  // eslint-disable-next-line no-undef
  m.mount(document.body, sfid);
// });
