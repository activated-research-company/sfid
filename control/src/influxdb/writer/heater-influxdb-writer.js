function getHeaterInfluxdbWriter(state, influxdb) {
  const writePoints = (state) => {
    influxdb.writePoints([{
      measurement: 'heater',
      fields: {
        setpoint: state.setpoint,
        temperature: state.actual,
      },
    }]);
  }
  
  state.subscribe({ type: 'heater', next: writePoints });
}

module.exports = (container) => {
  container.service('heaterInfluxdbWriter', getHeaterInfluxdbWriter, 'state', 'influxdb');
};
