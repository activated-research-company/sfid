const { InfluxDB, FieldType } = require('influx');

function getInfluxdb(env, logger) {
  if (!env.influxdb.host || !env.influxdb.port) { return null; }

  let connected = false;

  const initDatabase = (databaseNames) => {
    logger.info('influxdb connected');
    if (!databaseNames.includes('sfid')) {
      logger.warn('creating sfid database');
      return influxdb.createDatabase('sfid');
    }
    return null;
  }

  const setConnected = () => { connected = true; }

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
    .then(setConnected)
    .catch(handleError);
  };

  const influxdb = new InfluxDB({
    host: env.influxdb.host,
    port: env.influxdb.port,
    database: 'log',
    schema: [
      {
        measurement: 'entry',
        fields: {
          message: FieldType.STRING,
        },
        tags: ['container', 'level'],
      },
    ],
  });

  connect();

  return {
    writePoints: (measurements) => {
      if (connected) {
        influxdb.writePoints(
          measurements,
          {
            database: 'log',
            precision: 'ms',
          },
        )
        .catch((error) => {
          console.error(error.stack);
        });
      }
    },
  };
}

module.exports = (container) => {
  container.service(
    'influxdb',
    getInfluxdb,
    'env',
    'logger',
  );
};
