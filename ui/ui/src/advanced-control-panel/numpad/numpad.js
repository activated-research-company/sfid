function numpad(m, eventEmitter, modal, key) {
  function component() {
    let state;
    let pidTerm;
    let pidTerms;
    let pidTermChanged = false;
    let input = '';
    let inputChanged = false;

    const getMin = () => (state && state.min ? state.min : 0);
    const getMax = () => (state && !pidTerm ? state.max : Number.MAX_SAFE_INTEGER);

    function getTitle() {
      let title = '';
      if (state) {
        title = state.editTitle ? state.editTitle : state.chartTitle;
        if (!pidTerm) {
          title += ` (${getMin()}-${getMax()})`;
        } else {
          title += ` (k${pidTerm})`;
        }
      }
      return title;
    }

    const getUnits = () => (state && !pidTerm ? state.units : '');
    const isWithinTheMin = (value) => parseFloat(value) >= getMin();
    const isWithinTheMax = (value) => parseFloat(value) <= getMax();
    const isValidValue = (value) => isWithinTheMin(value) && isWithinTheMax(value);

    function onNumberKeyPress(value) {
      if (input === '0' && value === 0) { return; }
      if (value !== '.' || !input.includes('.')) {
        if (input === '0' && value !== '.') { input = ''; }
        input += value;
      }
      if (pidTerm) {
        pidTerms[`k${pidTerm}`] = parseFloat(input);
        pidTermChanged = true;
      }
    }

    function getKeyAttributes(value, margin) {
      return {
        value,
        margin,
      };
    }

    function revertToDefaultSetpoint() {
      inputChanged = true;
      input = state.defaultSetpoint.toString();
    }

    function getDefaultKeyAttributes() {
      const attributes = getKeyAttributes('DEFAULT');
      attributes.id = 'default-key';
      attributes.onClick = revertToDefaultSetpoint;
      attributes.disabled = state && input && parseFloat(input) === state.defaultSetpoint;
      return attributes;
    }

    function getNumericKeyAttributes(number, margin) {
      const attributes = getKeyAttributes(number, margin);
      attributes.onClick = () => {
        if (!inputChanged) {
          input = '0';
          inputChanged = true;
        }
        onNumberKeyPress(number);
      };
      attributes.disabled = !isWithinTheMax(inputChanged ? input + number : number);
      return attributes;
    }

    function getKeys(numbers) {
      return numbers.map((number, index) => {
        let margin = 0;
        if (index + 1 < numbers.length) { margin = 1; }
        return m(key, getNumericKeyAttributes(number, margin));
      });
    }

    function getZeroAttributes() {
      const attributes = getNumericKeyAttributes(0);
      attributes.id = 'zero-key';
      return attributes;
    }

    function del() {
      inputChanged = true;
      input = input.slice(0, -1);
      if (input.length === 0) { input = '0'; }
    }

    function getDeleteAttributes() {
      return {
        icon: {
          name: 'backspace',
          size: 'medium',
        },
        id: 'delete-key',
        onClick: del,
      };
    }

    function saveSetpoint() {
      state.setSetpoint(parseFloat(input));
      state = null;
    }

    function getSetpointSaveAttributes() {
      const attributes = getKeyAttributes('SAVE');
      attributes.id = 'save-key';
      attributes.onClick = saveSetpoint;
      attributes.disabled = !inputChanged || pidTerm || !isValidValue(input);
      return attributes;
    }

    function getPlayAttributes() {
      const attributes = getKeyAttributes('PLAY');
      attributes.id = 'play-key';
      attributes.icon = {
        name: 'play-arrow',
        size: 'large',
      };
      attributes.disabled = !state || (state.isEnabled && !state.isEnabled()) || !isValidValue(input);
      attributes.onClick = () => {
        state.setSetpoint(parseFloat(input));
        state.synchronize();
        state = null;
      };
      return attributes;
    }

    function getStopAttributes() {
      const attributes = getKeyAttributes('STOP');
      attributes.id = 'stop-key';
      attributes.icon = {
        name: 'stop',
        size: 'large',
      };
      attributes.disabled = !state || (state.isEnabled && !state.isEnabled());
      attributes.onClick = () => {
        state.turnOff();
        state = null;
      };
      return attributes;
    }

    function editState(stateToEdit) {
      if (stateToEdit) {
        state = stateToEdit;
        if (state.pidIdentifier) {
          pidTerms = {
            kp: state.kp,
            ki: state.ki,
            kd: state.kd,
          };
        } else {
          pidTerms = null;
        }
      }
      inputChanged = false;
      input = state.setpoint.toString();
    }

    function editPidTerm(term) {
      if (pidTerm !== term) {
        pidTerm = term;
        inputChanged = false;
        input = pidTerms[`k${pidTerm}`].toString();
      } else {
        pidTerm = '';
        editState();
      }
    }

    function getPidKeyAttributes(term) {
      const attributes = getKeyAttributes(term);
      attributes.onClick = () => {
        editPidTerm(term);
      };
      attributes.toggled = pidTerm === term;
      return attributes;
    }

    function savePidTerms() {
      state.setKp(pidTerms.kp);
      state.setKi(pidTerms.ki);
      state.setKd(pidTerms.kd);
      state = null;
      pidTerm = '';
      pidTerms = null;
    }

    function getPidSaveAttributes() {
      const attributes = getKeyAttributes('SAVE');
      attributes.id = 'pid-save-key';
      attributes.onClick = savePidTerms;
      attributes.disabled = !pidTerm || !pidTermChanged;
      return attributes;
    }

    function onclickout() {
      state = null;
      pidTerm = null;
    }

    return {
      oninit: () => {
        eventEmitter.on('editstate', editState);
      },
      onremove: () => {
        eventEmitter.off('editstate', editState);
      },
      view: () => m(modal, { id: 'numpad-modal', hide: !state, onclickout },
        m('.monospace', [
          m('.tc.f4', [
            m('x-label.mb3', getTitle()),
            m('.flex.bt', [
              m('x-label.b.br.pt2.numpad-input', `${input} ${getUnits()}`),
              m('.pl1.pb1.pt1.f7', m(key, getDefaultKeyAttributes())),
            ]),
          ]),
          m('.f2.b', [
            m('.flex', [
              m(`.pt1.bt.pr1.br.${state && state.pidIdentifier ? '.pb1' : ''}`, [
                m('.flex.pb1', getKeys([7, 8, 9])),
                m('.flex.pb1', getKeys([4, 5, 6])),
                m('.flex.pb1', getKeys([1, 2, 3])),
                m('.flex', [
                  m('.pr1', m(key, getZeroAttributes())),
                  m(key, getNumericKeyAttributes('.', 0)),
                ]),
              ]),
              m('.f4.pt1.bt.', [
                m('.pl1.pb1', m(key, getDeleteAttributes())),
                m('.pl1.pb1', m(key, getSetpointSaveAttributes())),
                m('.pl1.pb1', m(key, getPlayAttributes())),
                m('.pl1', m(key, getStopAttributes())),
              ]),
            ]),
            state && state.pidIdentifier ? m('.flex', [
              m('.flex.pt1.bt.pr1.br', [
                m('.pr1', m(key, getPidKeyAttributes('p'))),
                m('.pr1', m(key, getPidKeyAttributes('i'))),
                m('.', m(key, getPidKeyAttributes('d'))),
              ]),
              m('.bt.pl1.pt1.f4', m(key, getPidSaveAttributes())),
            ]) : null,
          ]),
        ]),
      ),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'numpad',
    numpad,
    'm',
    'eventEmitter',
    'modal',
    'key',
  );
};
