function fs(electron) {
  return electron.remote.require('fs');
}

module.exports = (container) => {
  container.service('fs', fs, 'electron');
};
