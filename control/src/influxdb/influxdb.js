const { InfluxDB, FieldType } = require('influx');

function getInfluxdb(env, logger) {
  if (!env.influxdb.host || !env.influxdb.port) { return null; }

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
    } else {
      console.error(errorString);
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
          flameTemperature: FieldType.FLAOT
        },
        tags: ['igniting', 'ignited'],
      },
      {
        measurement: 'heater',
        fields: {
          setpoint: FieldType.FLOAT,
          temperature: FieldType.FLOAT,
        },
        tags: [],
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
