const Bottle = require('bottlejs');

const bottle = new Bottle();

require('./electron/electron')(bottle);
require('./electron/app')(bottle);
require('./env/env')(bottle);
require('./fs/fs')(bottle);
require('./event-emitter/event-emitter')(bottle);

require('./path/path')(bottle);

require('./logger/winston')(bottle);
require('./logger/transport/console')(bottle);
require('./logger/transport/http')(bottle);
require('./logger/logger')(bottle);

require('./websocket/web-socket')(bottle);

require('./settings/settings')(bottle);
require('./settings/decorator/default')(bottle);
require('./settings/decorator/setter')(bottle);

require('./layout/logo/logo')(bottle);

require('./advanced-control-panel/numpad/key')(bottle);
require('./advanced-control-panel/numpad/numpad')(bottle);
require('./advanced-control-panel/advanced-fid-panel/advanced-fid-panel')(bottle);
require('./advanced-control-panel/advanced-control-panel')(bottle);

require('./button/button')(bottle);

require('./layout/clock/clock')(bottle);
require('./layout/change-clock/change-date')(bottle);
require('./layout/change-clock/change-time')(bottle);
require('./layout/change-clock/change-clock')(bottle);
require('./layout/chart/chart')(bottle);
require('./layout/chart/chart-factory')(bottle);
require('./layout/chart/chart-option')(bottle);
require('./layout/chart/chart-options')(bottle);

require('./log-panel/log-panel')(bottle);

require('./time/time')(bottle);
require('./time/moment')(bottle);

require('./simple-control-panel/emergency-shutdown/emergency-shutdown-button')(bottle);
require('./simple-control-panel/emergency-shutdown/emergency-shutdown-confirm')(bottle);

require('./environment-monitor/environment-monitor')(bottle);

require('./layout/error-message/error-message')(bottle);
require('./layout/error-message/error-message-factory')(bottle);
require('./layout/error-message/error-message-emitter')(bottle);
require('./layout/error-message/error-message-emitter-decorator/cell-compartment-leak')(bottle);
require('./layout/error-message/error-message-emitter-decorator/thermal-runaway')(bottle);
require('./layout/error-message/error-message-emitter-decorator/unresponsive-thermometer')(bottle);
require('./layout/error-message/error-message-emitter-decorator/stall')(bottle);

require('./layout/layout')(bottle);

require('./labelled-card/labelled-card')(bottle);

require('./m/m')(bottle);
require('./modal/modal')(bottle);

require('./simple-control-panel/mode/mode-button')(bottle);
require('./simple-control-panel/mode/mode-display')(bottle);
require('./simple-control-panel/mode/mode-step-display')(bottle);

require('./layout/nav/nav')(bottle);

require('./utility/round')(bottle);

require('./setpoint-saver/setpoint-saver')(bottle);

require('./simple-control-panel/simple-control-panel')(bottle);
require('./simple-control-panel/simple-fid-panel')(bottle);
require('./simple-control-panel/simple-system-panel')(bottle);

require('./state/state')(bottle);
require('./state/decorator/state-decorator')(bottle);
require('./state/decorator/state-decorator-default')(bottle);
require('./state/decorator/state-decorator-display')(bottle);
require('./state/decorator/state-decorator-chart')(bottle);
require('./state/decorator/state-decorator-get-actual')(bottle);
require('./state/decorator/state-decorator-get-device-setpoint')(bottle);
require('./state/decorator/state-decorator-is-connected')(bottle);
require('./state/decorator/state-decorator-get-setpoints')(bottle);
require('./state/decorator/state-decorator-online')(bottle);

require('./state-component/state-component-register')(bottle); // TODO: make registers for the large subfolders

require('./environment-monitor/sim/sim-button')(bottle);

require('./throbber/throbber')(bottle);

require('./layout/error-message/error-message-emitter-decorator/laser-interlock-sync')(bottle); // TODO: why doesn't this work where I want it to be

module.exports = bottle.container;
