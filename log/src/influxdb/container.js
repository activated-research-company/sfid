module.exports = (container) => {
  if (container.container.env.influxdb.useSim) {
    require('./influxdb-sim')(container);
  } else {
    require('./influxdb')(container);
  }
};
