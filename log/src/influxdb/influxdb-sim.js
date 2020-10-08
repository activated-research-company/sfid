function getInfluxdbSim(env) {
  if (!env.influxdb.host || !env.influxdb.port) { return null; }

  return {
    writePoints: () => new Promise(resolve => resolve()),
  };
}

module.exports = (container) => {
  container.service(
    'influxdb',
    getInfluxdbSim,
    'env',
  );
};
