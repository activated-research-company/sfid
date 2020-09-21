function simButton(m, button, webSocket) {
  function component() {
    let simulating = false;
    let startedSimulating;

    function simulate(event) {
      simulating = true;
      startedSimulating = new Date();
      setTimeout(() => {
        webSocket.emit(event);
        simulating = false;
      }, 5000);
    }

    function getTimer() {
      return 6 - Math.ceil((new Date() - startedSimulating) / 1000);
    }

    function getLabel(attrs) {
      return m('.x-label.tc.dark-blue', simulating ? getTimer() : attrs.label);
    }

    function getButton(attrs) {
      return m(button,
        {
          disabled: simulating,
          onclick: () => { simulate(attrs.event); },
        },
        getLabel(attrs));
    }

    return {
      view: ({ attrs }) => getButton(attrs),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service(
    'simButton',
    simButton,
    'm',
    'button',
    'webSocket',
  );
};
