function getSerialDevices(env) {
  const serialDevices = {};

  if (env.fc.isAttached) {
    serialDevices.fc = {
      name: 'alicat hub',
      onFoundEvent: 'alicathubfound',
      baudRate: env.fc.baudRate,
      probe: 'h\r',
      delimiter: Buffer.from('\r'),
      port: '',
    };
  }

  if (env.fid.isAttached) {
    serialDevices.fid = {
      name: 'fid',
      onFoundEvent: 'fidfound',
      baudRate: 115200,
      probe: 'LL\r\n',
      delimiter: '\r\n',
      port: '',
    };
  }

  return serialDevices;
}

module.exports = (container) => {
  container.service('serialDevices', getSerialDevices, 'env');
};
