function decorate(settings) {
  return new Proxy(settings, {
    set: (obj, prop, value) => obj.update(prop, value),
  });
}

module.exports = (container) => {
  container.decorator('settings', decorate);
};
