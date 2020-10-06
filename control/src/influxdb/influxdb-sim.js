function getInfluxdb(env) {
  if (!env.influxdb.host || !env.influxdb.port) { return null; }

  return {
    writePoints: () => null,
  };
}

module.exports = (container) => {
  container.service(
    'influxdb',
    getInfluxdb,
    'env',
  );
};
