function decorate(settings) {
  const decoratedSettings = settings;

  decoratedSettings.fidKp = 12;
  decoratedSettings.fidKi = 0.44;
  decoratedSettings.fidKd = 81;

  return decoratedSettings;
}

module.exports = (container) => {
  container.decorator('settings', decorate);
};
