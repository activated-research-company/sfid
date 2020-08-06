function changeDate(m, time, webSocket) {
  function getComponent() {
    let currentDate;

    function onchange(e) {
      currentDate = e.target.value;
      webSocket.emit('setdate', currentDate);
    }

    return {
      oninit: () => {
        currentDate = time.now().format('YYYY-MM-DD');
      },
      view: () => m('x-dateselect', { value: currentDate, onchange }),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service('changeDate', changeDate, 'm', 'time', 'webSocket');
};
