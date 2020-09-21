function modeButton(m, eventEmitter, systemState, button) {
  function component() {
    let thisMode;
    let mode = {
      current: '',
      inProcess: '',
    };

    function onMode(newmode) {
      mode = newmode;
    }

    function isEnabled() {
      return (!mode.inProcess || thisMode === mode.inProcess) && thisMode !== mode.current;
    }

    function isToggled() {
      return thisMode === mode.inProcess;
    }

    function onClick() {
      eventEmitter.emit(`${thisMode}.${isToggled() ? 'stop' : 'start'}`, systemState.getSetpoints());
      mode.current = '';
      mode.inProcess = thisMode;
    }

    return {
      oninit: ({ attrs }) => {
        thisMode = attrs.mode;
        eventEmitter.on('mode', onMode);
      },
      onremove: () => {
        eventEmitter.off('mode', onMode);
      },
      view: ({ attrs: { label, icon } }) => m(button, {
        label: isToggled() ? `Cancel ${label}` : label,
        icon,
        large: true,
        disabled: !isEnabled(),
        toggled: isToggled(),
        onclick: onClick,
      }),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('modeButton', modeButton, 'm', 'eventEmitter', 'systemState', 'button');
};
