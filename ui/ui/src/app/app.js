function app(electron) {
  return electron.remote.app;
}

module.exports = (container) => {
  container.service('app', app, 'electron');
};
