function decorate(settings) {
  const decoratedSettings = settings;
  decoratedSettings.country = 'US';
  decoratedSettings.timezone = 'America/Chicago';
  return decoratedSettings;
}

module.exports = (container) => {
  container.decorator('settings', decorate);
};
