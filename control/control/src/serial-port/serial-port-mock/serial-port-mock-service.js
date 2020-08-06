function serialPortMockService(eventEmitter, env) {
  const alicatHub = require('./alicat-hub-port-mock')();
  const fid = require('./fid-port-mock')(eventEmitter);

  return {
    // TODO: this should use env.js
    getMock: (port) => {
      switch (port) {
        case env.fc.simPort:
          return alicatHub;
        case env.fid.simPort:
          return fid;
        default:
          return null;
      }
    },
  };
}

module.exports = (container) => {
  container.service('serialPortMockService', serialPortMockService, 'eventEmitter', 'env');
};
