const { InfluxDB, FieldType } = require('influx');

function getInfluxdb(env, logger) {
  if (!env.influxdb.host || !env.influxdb.port) { return {}; }

  const initDatabase = (databaseNames) => {
    logger.info('influxdb connected');
    if (!databaseNames.includes('sfid')) {
      return influxdb.createDatabase('sfid');
    }
    return null;
  }

  const handleError = (error) => {
    const errorString = error.toString();
    if (errorString.includes('ECONNREFUSED')) {
      console.warn('influxdb connection refused');
      setTimeout(connect, 10000);
    }
  }

  const connect = () => {
    return influxdb
    .getDatabaseNames()
    .then(initDatabase)
    .catch(handleError);
  };

  const influxdb = new InfluxDB({
    host: env.influxdb.host,
    port: env.influxdb.port,
    database: 'sfid',
    schema: [
      {
        measurement: 'fid',
        fields: {
          voltage: FieldType.FLOAT,
        },
        tags: ['ignited'],
      },
    ],
  });

  connect();

  return influxdb;
}

module.exports = (container) => {
  container.service(
    'influxdb',
    getInfluxdb,
    'env',
    'logger',
  );
};
