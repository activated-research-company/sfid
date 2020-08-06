function getSettings(env, fs, path, logger) { // TODO: centralize this logic among containers somehow
  const directory = path.join(env.dataPath, 'api');
  const fileName = path.join(directory, 'settings.json');
  const settings = {};

  function load() {
    return new Promise((resolve) => {
      fs.access(fileName, (accessError) => {
        if (accessError) {
          logger.warn(`settings file doesn't exist [${accessError}]`);
          resolve();
        } else {
          fs.readFile(fileName, (readError, data) => {
            if (readError) {
              logger.error(`could not read settings file [${readError}]`);
            } else {
              const savedSettings = JSON.parse(data.toString());
              Object.keys(savedSettings).forEach((setting) => {
                settings[setting] = savedSettings[setting];
              });
            }
            resolve();
          });
        }
      });
    });
  }

  function update(setting, value) {
    settings[setting] = value;
    if (!fs.existsSync(directory)) { fs.mkdirSync(directory); }
    fs.writeFile(fileName, JSON.stringify(settings), 'utf8', (err) => {
      if (err) {
        logger.error(`unable to write settings file [${err}]`);
      }
    });
    return true;
  }

  settings.load = load;
  settings.update = update;

  return settings;
}

module.exports = (container) => {
  container.service('settings', getSettings, 'env', 'fs', 'path', 'logger');
};