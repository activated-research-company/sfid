const Bottle = require('bottlejs');

const bottle = new Bottle();

require('./env/env')(bottle);
require('./logger/container')(bottle);
require('./influxdb/container')(bottle);

module.exports = bottle.container;
