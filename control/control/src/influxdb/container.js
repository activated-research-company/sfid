module.exports = (container) => {
  require('./influxdb')(container);
  if (container.influxdb) {
    require('./writer/fid-influxdb-writer')(container);
    require('./writer/heater-influxdb-writer')(container);
  }
};
