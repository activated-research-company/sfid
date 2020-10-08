const { InfluxDB, FieldType } = require('influx');

function getInfluxdb(env, logLogger) {
  if (!env.influxdb.host || !env.influxdb.port) { return null; }

  let connected = false;

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

  const setConnected = () => { connected = true; };

  const initDatabase = (databaseNames) => {
    logLogger.info('influxdb connected');
    if (!databaseNames.includes('log')) {
      logLogger.warn('creating log database');
      return influxdb.createDatabase('log');
    }
    return null;
  };

  const connect = () => {
    return influxdb
      .getDatabaseNames()
      .then(initDatabase)
      .then(setConnected)
      .catch((error) => {
        const errorString = error.toString();
        if (errorString.includes('ECONNREFUSED')) {
          console.warn('influxdb connection refused');
          setTimeout(connect, 10000);
        } else {
          console.error(errorString);
        }
      });
  };

  connect();

  return {
    writePoints: (measurements) => {
      if (connected) {
        influxdb
          .writePoints(
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
    'logLogger',
  );
};
