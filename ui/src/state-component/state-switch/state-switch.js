require('./state-switch.css');

function stateSwitch(m, stateLabel) {
  function component() {
    const latchTime = 1500;
    let latched = false;
    let latchValue = false;

    const unlatch = () => { latched = false; };

    function latch(toggled) {
      latched = true;
      latchValue = toggled;
      setTimeout(unlatch, latchTime);
    }

    function toggle(state, toggled) {
      latch(toggled);
      state.setpoint = toggled;
      state.synchronize();
    }

    function isToggled(state) {
      if (latched) { return latchValue; }
      return state.actual;
    }

    function getSwitch(state, disabled) {
      return m(
        `x-switch.ma-aa${disabled || !state.isConnected() || latched ? '[disabled]' : ''}${isToggled(state) ? '[toggled]' : ''}`,
        {
          onclick: () => toggle(state, !state.actual),
        },
      );
    }

    function getOffLabel(state) {
      return state.switch && state.switch.off ? state.switch.off : 'Off';
    }

    function getOnLabel(state) {
      return state.switch && state.switch.on ? state.switch.on : 'On';
    }

    function getSwitchWithLabel(state, disabled) {
      return m('.h-100', [
        m('.w-100.flex', [
          m('.w-50', m(stateLabel, { state })),
          m('.w-50.ma-aa', getSwitch(state, disabled || !state.isEnabled())),
        ]),
        m('.w-100.pl1.monospace.b', [
          m('.flex.f7', [
            m('.w-50'),
            m('.w-50.flex.pt1', [
              m('x-label.w-35.rtl.tr', getOffLabel(state)),
              m('.w-30'),
              m('x-label.w-35.rtl.tl', getOnLabel(state)),
            ]),
          ]),
        ]),
      ]);
    }

    function getColor(state) {
      return !state.isEnabled || state.isEnabled() ? 'dark-blue' : 'black';
    }

    function getSwitchWithoutLabel(state, disabled) {
      return m('.flex.pt1', [
        m(`x-label.w-40.tc.${getColor(state)}`, getOffLabel(state)),
        m('.w-20.ma-aa', getSwitch(state, disabled || !state.isEnabled())),
        m(`x-label.w-40.tc.${getColor(state)}`, getOnLabel(state)),
      ]);
    }

    return {
      view: ({ attrs: { state, disabled, hideLabel } }) => (hideLabel ? getSwitchWithoutLabel(state, disabled) : getSwitchWithLabel(state, disabled)),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'stateSwitch',
    stateSwitch,
    'm',
    'stateLabel',
  );
};
