function getFidInfluxdbWriter(state, influxdb) {
  const writePoints = (fid) => {
    influxdb.writePoints([{
      measurement: 'fid',
      fields: {
        voltage: fid.voltage,
        flameTemperature: fid.temperature,
      },
      tags: {
        igniting: fid.igniting ? '1' : '0',
        ignited: fid.ignited ? '1' : '0',
      },
    }]);
  };

  state.subscribe({ type: 'fid', next: writePoints });
}

module.exports = (container) => {
  container.service('fidInfluxdbWriter', getFidInfluxdbWriter, 'state', 'influxdb');
};
