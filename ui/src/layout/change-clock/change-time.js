function changeTime(m, time, button, eventEmitter, webSocket) {
  function getComponent() {
    let currentHours;
    let currentMinutes;
    let currentAmOrPm;
    let changedTime = false;

    function getHoursString() {
      let hours = '';
      if (currentAmOrPm === 'AM') {
        hours += currentHours === 12 ? 0 : currentHours;
      } else {
        hours += currentHours === 12 ? 12 : currentHours + 12;
      }
      return `${hours.length === 1 ? '0' : ''}${hours}`;
    }

    function getMinutesString() {
      return `${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;
    }

    function getSecondsString() {
      let seconds = '';
      seconds += time.now().seconds();
      return `${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function getTimeString() {
      return `${getHoursString()}:${getMinutesString()}:${getSecondsString()}`;
    }

    function flipCurrentAmOrPm() {
      currentAmOrPm = currentAmOrPm === 'AM' ? 'PM' : 'AM';
      changedTime = true;
    }

    function incrementHours() {
      currentHours += 1;
      if (currentHours === 12) { flipCurrentAmOrPm(); }
      if (currentHours === 13) { currentHours = 1; }
      changedTime = true;
    }

    function decrementHours() {
      currentHours -= 1;
      if (currentHours === 0) { currentHours = 12; }
      if (currentHours === 11) { flipCurrentAmOrPm(); }
      changedTime = true;
    }

    function incrementMinutes() {
      currentMinutes += 1;
      if (currentMinutes === 60) {
        currentMinutes = 0;
        incrementHours();
      }
      changedTime = true;
    }

    function decrementMinutes() {
      currentMinutes -= 1;
      if (currentMinutes === -1) {
        currentMinutes = 59;
        decrementHours();
      }
      changedTime = true;
    }

    function getAmPmButton(amOrPm) {
      return m(button, {
        label: amOrPm,
        toggled: currentAmOrPm === amOrPm,
        onclick: () => {
          currentAmOrPm = amOrPm;
        },
      });
    }

    function oninit() {
      const now = time.now();
      currentHours = parseInt(now.format('h'), 10);
      currentMinutes = now.minutes();
      currentAmOrPm = now.format('A');
    }

    function onremove() {
      if (changedTime) { webSocket.emit('settime', getTimeString()); }
    }

    function view() {
      return m('.flex', [
        m('.w-20', [
          m(button, {
            label: '+',
            onclick: incrementHours,
          }),
          m('.ma-aa.tc', `${currentHours < 10 ? '0' : ''}${currentHours}`),
          m(button, {
            label: '-',
            onclick: decrementHours,
          }),
        ]),
        m('.w-10.tc.f5.b.ma-aa', ':'),
        m('.w-20', [
          m(button, {
            label: '+',
            onclick: incrementMinutes,
          }),
          m('.ma-aa.tc', getMinutesString()),
          m(button, {
            label: '-',
            onclick: decrementMinutes,
          }),
        ]),
        m('.w-50.pl3.flex.ma-aa', [
          m('.pr1.w-50', getAmPmButton('AM')),
          m('.pl1.w-50', getAmPmButton('PM')),
        ]),
      ]);
    }

    return {
      oninit,
      onremove,
      view,
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service('changeTime', changeTime, 'm', 'time', 'button', 'eventEmitter', 'webSocket');
};
