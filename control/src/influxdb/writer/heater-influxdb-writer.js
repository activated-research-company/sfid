function getHeaterInfluxdbWriter(state, influxdb) {
  const writePoints = (state) => {
    influxdb.writePoints(
      [
        {
          measurement: 'heater',
          fields: {
            setpoint: state.setpoint,
            temperature: state.actual,
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
  
  state.subscribe({ type: 'heater', next: writePoints });
}

module.exports = (container) => {
  container.service('heaterInfluxdbWriter', getHeaterInfluxdbWriter, 'state', 'influxdb');
};
