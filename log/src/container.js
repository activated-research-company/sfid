const Bottle = require('bottlejs');

const bottle = new Bottle();

require('./env/env')(bottle);

require('./path/path')(bottle);

require('./logger/winston')(bottle);
require('./logger/logger-factory')(bottle);
require('./logger/transport/console-transport-factory')(bottle);
require('./logger/transport/file-transport-factory')(bottle);
require('./logger/control-logger')(bottle);
require('./logger/ui-logger')(bottle);
require('./logger/log-logger')(bottle);

module.exports = bottle.container;
