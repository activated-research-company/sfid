const influx = require('influx');

function getInflux(env) {
  if (!env.influxdb.host || !env.influxdb.port) { return {}; }

  const influxdb = new influx.InfluxDB({
    host: env.influxdb.host,
    port: env.influxdb.port,
    database: 'sfid',
    schema: [
      {
        measurement: 'fid',
        fields: {
          voltage: influx.FieldType.FLOAT,
          temperature: influx.FieldType.FLOAT,
          flameTemperature: influx.FieldType.FLOAT,
        },
        tags: ['flame'],
      },
    ],
  });

  influxdb
    .getDatabaseNames()
    .then((names) => {
      if (!names.includes('solvere')) {
        return influxdb.createDatabase('solvere');
      }
      return null;
    });

  return influxdb;
}

module.exports = (container) => {
  container.service('influx', getInflux, 'env');
};
