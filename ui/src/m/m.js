const mithril = require('mithril');

function getMithril() {
  return mithril;
}

module.exports = (container) => {
  container.service('m', getMithril);
};
