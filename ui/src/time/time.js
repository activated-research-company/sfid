function getTime(moment) {
  function now() {
    return moment();
  }

  return {
    now,
  };
}

module.exports = (container) => {
  container.service('time', getTime, 'moment');
};
