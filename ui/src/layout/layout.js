function layout(
  m,
  env,
  webSocket,
  eventEmitter,
  logo,
  nav,
  clock,
  chart,
  emergencyShutdownButton,
  modal,
  errorMessage,
  changeClock,
  emergencyShutdownConfirm,
) {
  function component() {
    let lastTouch = new Date();

    function updateLastTouch() {
      lastTouch = new Date();
    }

    return {
      oncreate: () => {
        if (!env.isWeb) { eventEmitter.emit('changeclock'); }
      },
      view: ({ attrs, children }) => m(
        '.relative.max.pt2.bg-light-gray',
        {
          onmouseup: updateLastTouch,
          ontouchend: updateLastTouch,
        },
        [
          env.isWeb || new Date() - lastTouch < env.screenSleepTime ? null : m(modal),
          m(`.absolute.l-20px.h-5px.w-18px${webSocket.isConnected() ? '' : '.spin'}`, m(logo)),
          m('.absolute.t-14px.r-13px.f7', m(clock)),
          [
            m('.mb2.flex', m('.ma-aa.w-fc.shadow-1', m(nav))),
            m(`.w-100.${attrs.hideChart ? '' : 'mb2'}`, children),
            attrs.hideChart ? null : m('.w-100', { id: `${attrs.route}-chart` }, m(chart)),
          ],
          attrs.hideChart ? null : m('.absolute.bottom-1h.right-1h.f7.w-785px.z-3', m(emergencyShutdownButton)),
          m(changeClock),
          m(errorMessage),
          attrs.hideChart ? null : m(emergencyShutdownConfirm),
        ],
      ),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'layout',
    layout,
    'm',
    'env',
    'webSocket',
    'eventEmitter',
    'logo',
    'nav',
    'clock',
    'chart',
    'emergencyShutdownButton',
    'modal',
    'errorMessage',
    'changeClock',
    'emergencyShutdownConfirm',
  );
};
