function getFidInfluxdbWriter(state, influxdb) {
  const writePoints = (state) => {
    influxdb.writePoints(
      [
        {
          measurement: 'fid',
          fields: {
            voltage: state.voltage,
            flameTemperature: state.temperature,
          },
          tags: {
            igniting: state.igniting ? '1' : '0',
            ignited: state.ignited ? '1' : '0',
          },
        },
      ],
      {
        database: 'sfid',
        precision: 'ms',
      },
    )
    .catch((error) => {
      console.error(error.stack);
    });
  }
  
  state.subscribe({ type: 'fid', next: writePoints });
}

module.exports = (container) => {
  container.service('fidInfluxdbWriter', getFidInfluxdbWriter, 'state', 'influxdb');
};
