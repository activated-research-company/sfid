function getHydrogenInfluxdbWriter(state, influxdb) {
  const writePoints = (state) => {
    influxdb.writePoints([{
      measurement: 'hydrogen',
      fields: {
        setpoint: state.setpoint,
        actual: parseFloat(state.flow),
        pressure: parseFloat(state.pressure),
        temperature: parseFloat(state.temperature),
      },
    }]);
  }
  
  state.subscribe({ type: 'hydrogen', next: writePoints });
}

module.exports = (container) => {
  container.service('hydrogenInfluxdbWriter', getHydrogenInfluxdbWriter, 'state', 'influxdb');
};
