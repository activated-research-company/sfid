module.exports = (container) => {
  if (container.container.env.influxdb.useSim) {
    require('./influxdb-sim')(container);
  } else {
    require('./influxdb')(container);
  }
  if (container.container.influxdb) {
    require('./writer/air-influxdb-writer')(container);
    require('./writer/fid-influxdb-writer')(container);
    require('./writer/heater-influxdb-writer')(container);
    require('./writer/hydrogen-influxdb-writer')(container);
  }
};
