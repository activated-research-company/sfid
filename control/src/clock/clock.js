const { DateTimeControl } = require('set-system-clock');
const moment = require('moment-timezone');

const clock = new DateTimeControl();

function getClock(logger, eventEmitter) {
  const dateFormat = 'YYYY-MM-DD';
  const timeFormat = 'HH:mm:ss';
  const format = `${dateFormat} ${timeFormat}`;

  function getDateString(fromDate) {
    return moment(fromDate).format(dateFormat);
  }

  function getTimeString(fromDate) {
    return moment(fromDate).format(timeFormat);
  }

  function getDateTimeString(fromDate) {
    return `${getDateString(fromDate)} ${getTimeString(fromDate)}`;
  }

  function changeDateTime(which, to) {
    const newDatetime = moment(getDateTimeString(to), format);
    clock.setDateTime(newDatetime.toDate());
    logger.info(`changed ${which} to ${getDateTimeString(newDatetime.format(format))}`);
  }

  function setDate(dateString) {
    const newDate = new Date(`${dateString} ${getTimeString(new Date())}`);
    changeDateTime('date', newDate);
  }

  function setTime(timeString) {
    const newDate = new Date(`${getDateString(new Date())} ${timeString}`);
    changeDateTime('time', newDate);
  }

  function listen() {
    eventEmitter
      .on('setdate', setDate)
      .on('settime', setTime);
  }

  return {
    listen,
    stopListening: () => null,
  };
}

module.exports = (container) => {
  container.service('clock', getClock, 'logger', 'eventEmitter');
};
