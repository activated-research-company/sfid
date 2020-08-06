/* eslint-disable import/newline-after-import */

const Bottle = require('bottlejs');

const bottle = new Bottle();

bottle.constant('delay', require('./utilitites/delay'));
bottle.constant('eventRegistry', require('./event-registry/event-registry'));

function listen(service) {
  if (service.listen && service.stopListening) { service.listen(); }
  return service;
}

bottle.decorator(listen);

require('./settings/settings')(bottle);
require('./settings/decorator/default')(bottle);
require('./settings/decorator/setter')(bottle);

require('./computer-information/computer-information')(bottle);
require('./computer-information/computer-information-service')(bottle);

require('./env/env')(bottle);

require('./influx/influx')(bottle);

require('./serial-device/serial-devices')(bottle);

require('./event-emitter/event-emitter-on-all-decorator')(bottle);
require('./event-emitter/event-emitter')(bottle);

require('./mode/fid/fid-stage-one')(bottle);
require('./mode/fid/fid-stage-two')(bottle);
require('./mode/fid/fid-stage-three')(bottle);
require('./mode/fid/fid-stage-four')(bottle);
require('./mode/fid/fid-stage-complete')(bottle);

require('./http-server/http-server')(bottle);

require('./path/path')(bottle);
require('./fs/fs')(bottle);

require('./logger/winston')(bottle);
require('./logger/logger')(bottle);
require('./logger/transport/console')(bottle);
require('./logger/transport/http')(bottle);

require('./env/env-validator')(bottle);
require('./env/env-logger')(bottle);

require('./clock/clock')(bottle);

require('./ready-service/ready-service')(bottle);

require('./serial-port/serial-port-factory')(bottle);
require('./serial-port/serial-port-mock/serial-port-mock-service')(bottle);

require('./mode/reached-setpoint')(bottle);
require('./mode/mode-service')(bottle);
require('./mode/mode-stage-decorator')(bottle);

require('./mode/analyze/analyze-stage-one')(bottle);
require('./mode/analyze/analyze-stage-two')(bottle);
require('./mode/analyze/analyze-stage-three')(bottle);
require('./mode/analyze/analyze-stage-four')(bottle);
require('./mode/analyze/analyze-stage-complete')(bottle);

require('./mode/shutdown/shutdown-stage-one')(bottle);
require('./mode/shutdown/shutdown-stage-two')(bottle);
require('./mode/shutdown/shutdown-stage-three')(bottle);
require('./mode/shutdown/shutdown-stage-four')(bottle);
require('./mode/shutdown/shutdown-stage-five')(bottle);
require('./mode/shutdown/shutdown-stage-complete')(bottle);

require('./mode/standby/standby-stage-one')(bottle);
require('./mode/standby/standby-stage-two')(bottle);
require('./mode/standby/standby-stage-three')(bottle);
require('./mode/standby/standby-stage-four')(bottle);
require('./mode/standby/standby-stage-complete')(bottle);

require('./phidget/phidget')(bottle);
require('./phidget-channel-sim/digital-output-channel-sim')(bottle);
require('./phidget-channel-sim/temperature-sensor-channel-sim')(bottle);
require('./phidget-channel-sim/channel-sim-service')(bottle);
require('./phidget-decorator/mock-phidget-decorator')(bottle);
require('./phidget-decorator/real-phidget-decorator')(bottle);
require('./phidget-decorator/phidget-decorator')(bottle);
require('./phidget-factory/phidget-factory')(bottle);

require('./web-socket/web-socket')(bottle);
require('./web-socket/web-socket-server')(bottle);

require('./digital-output/digital-output-factory')(bottle);

require('./indicator-light/indicator-light-factory')(bottle);
require('./indicator-light/red-indicator-light')(bottle);
require('./indicator-light/orange-indicator-light')(bottle);
require('./indicator-light/green-indicator-light')(bottle);

require('./temperature-sensor/temperature-sensor-factory')(bottle);
require('./temperature-controller/pid-controller/pid-controller')(bottle);
require('./temperature-controller/pid-controller/pid-controller-factory')(bottle);
require('./temperature-controller/temperature-controller-factory')(bottle);
require('./temperature-controller/decorator/thermal-runaway-detector')(bottle);
require('./temperature-controller/decorator/unresponsive-thermometer-detector')(bottle);

function instantiateServices() {
  Object.keys(bottle.originalProviders).forEach((provider) => {
    // eslint-disable-next-line no-unused-expressions
    bottle.container[provider];
  });
}

instantiateServices();

module.exports = bottle.container;
