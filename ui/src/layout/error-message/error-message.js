require('./error-message.css');

function errorMessage(m, eventEmitter, modal, button) {
  function component() {
    let error;
    let message;

    function showMessage(newMessage) {
      if (!error) {
        message = newMessage;
        error = true;
      }
    }

    function getTitle() {
      return message ? message.title : '';
    }

    function getContent() {
      if (!message) {return null; }
      if (Array.isArray(message.content)) {
        return message.content.map((line) => m('.pt2', line));
      }
      return message.content;
    }

    function getOccurredOn() {
      return message ? `This error occurred on ${message.occurred.format('YYYY-MM-DD')} at ${message.occurred.format('HH:mm:ss')}.` : '';
    }

    function clearMessage() {
      error = false;
      eventEmitter.emit('clearerror');
    }

    return {
      oninit: () => {
        eventEmitter.on('errormessage', showMessage);
      },
      view: () => m(`.z-999${error ? '' : '.dn'}`, m(modal, { id: 'error-message-modal' }, [
        m('h3.tc.b', getTitle()),
        m('.pa2', getContent()),
        m('.pa2.tc', getOccurredOn()),
        m('.pa2', m(button, { onclick: clearMessage, label: 'Close' })),
      ])),
      onremove: () => {
        eventEmitter.off('errormessage', showMessage);
      },
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('errorMessage', errorMessage, 'm', 'eventEmitter', 'modal', 'button');
};
