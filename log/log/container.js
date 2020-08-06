const Bottle = require('bottlejs');

const bottle = new Bottle();

require('./src/env/env')(bottle);

require('./src/path/path')(bottle);

require('./src/logger/winston')(bottle);
require('./src/logger/logger-factory')(bottle);
require('./src/logger/transport/console-transport-factory')(bottle);
require('./src/logger/transport/file-transport-factory')(bottle);
require('./src/logger/api-logger')(bottle);
require('./src/logger/app-logger')(bottle);
require('./src/logger/log-logger')(bottle);

module.exports = bottle.container;
