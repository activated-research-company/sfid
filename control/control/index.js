/* eslint-disable import/newline-after-import, import/order, no-unused-vars, global-require */

// TODO: put this file in the root of src (for some reason breaks in the docker container, probably template pointing to the wrong directory)
// TODO: bottlejs this entire mess

const {
  env,
  settings,
  state,
  webSocketServer,
  influx,
  eventEmitter,
  eventRegistry,
  logger,
  readyService,
  serialPortFactory,
  phidget,
  phidgetFactory,
  temperatureSensorFactory,
  digitalOutputFactory,
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
    eventEmitter.on('computer.time', ({ uptime }) => {
      if (!ready) {
        eventEmitter.emit('components.progress', Math.floor(uptime));
        if (uptime > env.startup.time) {
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
  
  const fidTemperatureController = temperatureControllerFactory.getNewTemperatureController(
    'fid',
    env.fid.temperatureSensor.hub,
    env.fid.temperatureSensor.port,
    env.fid.heater.hub,
    env.fid.heater.port,
    env.fid.heater.channel,
  );

  const serialPortRegistrar = require('./src/serial-port/serial-port-registrar')(serialDevices, serialPortFactory, eventEmitter, logger);

  const alicatDeviceFactory = require('./src/serial-device/alicat/alicat-device-factory')();
  const AlicatHub = require('./src/serial-device/alicat/alicat-hub');
  const Fid = require('./src/serial-device/fid');

  const alicatHub = new AlicatHub(
    serialDevices.alicatHub,
    serialPortFactory,
    eventEmitter,
    [
      alicatDeviceFactory.getNewFlowController('a', 'fidair'),
      alicatDeviceFactory.getNewFlowController('h', 'fidhydrogen'),
    ],
    state,
  );

  const fid = new Fid(serialPortFactory, serialDevices, env.fid.sampleRate, influx, eventEmitter, state);

  serialPortRegistrar.registerSerialPorts();
};

state.subscribe(console.log);

settings
  .load()
  .then(webSocketServer.listen)
  .then(waitForComponentStartup)
  .then(listen);
