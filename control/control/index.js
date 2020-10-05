/* eslint-disable import/newline-after-import, import/order, no-unused-vars, global-require */

// TODO: put this file in the root of src (for some reason breaks in the docker container, probably template pointing to the wrong directory)
// TODO: bottlejs this entire mess

const {
  env,
  settings,
  state,
  webSocketServer,
  influxdb,
  eventEmitter,
  logger,
  readyService,
  serialPortFactory,
  phidget,
  redIndicatorLight,
  orangeIndicatorLight,
  greenIndicatorLight,
  temperatureControllerFactory,
  serialDevices,
} = require('./src/container');

const waitForComponentStartup = () => {
  
  logger.info('components initializing');

  eventEmitter.emit('components.started', env.startup.time);

  const phidgetManager = require('./src/phidget-manager/phidget-manager')(env, phidget, logger);
  phidgetManager.connect();

  redIndicatorLight.listen();
  orangeIndicatorLight.listen();
  greenIndicatorLight.listen();

  let ready = false;
  return new Promise((resolve) => {
    eventEmitter.on('computer.time', ({ actual }) => {
      if (!ready) {
        eventEmitter.emit('components.progress', Math.floor(actual));
        if (actual > env.startup.time) {
          logger.info('connecting to components');
          eventEmitter.emit('components.complete');
          ready = true;
          readyService.listen();
          resolve();
        }
      }
    });
  });
};

const listen = () => {
  let fc;
  if (env.fc.isAttached) {
    const AlicatHub = require('./src/serial-device/alicat/alicat-hub');
    const alicatDeviceFactory = require('./src/serial-device/alicat/alicat-device-factory')();
    fc = new AlicatHub(
      serialDevices.fc,
      serialPortFactory,
      eventEmitter,
      [
        alicatDeviceFactory.getNewFlowController('a', 'fidair'),
        alicatDeviceFactory.getNewFlowController('h', 'fidhydrogen'),
      ],
      state,
    );
  }

  let fidTemperatureController;
  let fid;
  if (env.fid.isAttached) {
    fidTemperatureController = temperatureControllerFactory.getNewTemperatureController(
      'fid',
      env.fid.temperatureSensor.hub,
      env.fid.temperatureSensor.port,
      env.fid.heater.hub,
      env.fid.heater.port,
      env.fid.heater.channel,
    );
  
    const Fid = require('./src/serial-device/fid');
    fid = new Fid(serialPortFactory, serialDevices, env.fid.sampleRate, influxdb, eventEmitter, state);
  }

  const serialPortRegistrar = require('./src/serial-port/serial-port-registrar')(serialDevices, serialPortFactory, eventEmitter, logger);
  serialPortRegistrar.registerSerialPorts();
};

settings
  .load()
  .then(webSocketServer.listen)
  .then(waitForComponentStartup)
  .then(listen);
