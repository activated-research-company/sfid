function getInfluxdb(env) {
  if (!env.influxdb.host || !env.influxdb.port) { return null; }

  return {
    writePoints: (measurements) => {
      // console.log(measurements[0]);
      return new Promise((resolve) => resolve());
    },
  };
}

module.exports = (container) => {
  container.service(
    'influxdb',
    getInfluxdb,
    'env',
  );
};
