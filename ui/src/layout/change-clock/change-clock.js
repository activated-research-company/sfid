require('./change-clock.css');

function changeClock(m, modal, env, eventEmitter, changeDate, changeTime) {
  function getComponent() {
    let hide = true;
    let changedAtLeastOnce = !env.isWeb;

    function onChangeClock() { hide = false; }
    function onClickout() {
      hide = true;
      changedAtLeastOnce = true;
    }

    return {
      oninit: () => {
        eventEmitter.on('changeclock', onChangeClock);
      },
      onremove: () => {
        eventEmitter.off('changeclock', onChangeClock);
      },
      view: () => m(modal, { id: 'chart-options-modal', hide, onclickout: onClickout }, [
        !changedAtLeastOnce ? m('.tc.pb3', 'Please set the date and time.') : null,
        m('.w-100.pb3.flex', [
          m('x-label.w-30.mt-auto.mb-auto.pr3.tr', 'Date:'),
          m('.w-70', m(changeDate)),
        ]),
        hide ? null : m('.w-100.flex', [
          m('x-label.w-30.mt-auto.mb-auto.pr3.tr', 'Time:'),
          m('.w-70', m(changeTime)),
        ]),
      ]),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'changeClock',
    changeClock,
    'm',
    'modal',
    'env',
    'eventEmitter',
    'changeDate',
    'changeTime',
  );
};
