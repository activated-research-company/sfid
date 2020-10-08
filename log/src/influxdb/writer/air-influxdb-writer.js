function getAirInfluxdbWriter(state, influxdb) {
  const writePoints = (state) => {
    influxdb.writePoints([{
      measurement: 'air',
      fields: {
        setpoint: state.setpoint,
        actual: parseFloat(state.flow),
        pressure: parseFloat(state.pressure),
        temperature: parseFloat(state.temperature),
      },
    }]);
  }
  
  state.subscribe({ type: 'air', next: writePoints });
}

module.exports = (container) => {
  container.service('airInfluxdbWriter', getAirInfluxdbWriter, 'state', 'influxdb');
};
