const fs = require('fs');
const path = require('path');

function setpointSaver(env, logger) {
  const fileName = path.join(env.persistentDataPath, 'setpoints.json');
  let savedSetpoints = {};

  return {
    save: (event, setpoint) => {
      savedSetpoints[event] = { setpoint };
      fs.writeFile(fileName, JSON.stringify(savedSetpoints), 'utf8', (err) => {
        if (err) {
          logger.error(`unable to write setpoint file [${err}]`);
        }
      });
    },
    load: (systemState) => {
      fs.access(env.persistentDataPath, (err) => { // TODO: this check should be done globally
        if (err) {
          logger.error(`unable to find path to persistent data [${err}]`);
        }
        fs.access(fileName, (err) => {
          if (err) {
            logger.info(`setpoint file doesn't exist [${err}]`);
          } else {
            fs.readFile(fileName, (err, data) => {
              if (err) {
                logger.error(`could not read setpoint file [${err}]`);
              } else {
                savedSetpoints = JSON.parse(data.toString());
                Object.keys(savedSetpoints).forEach((savedSetpoint) => {
                  Object.keys(systemState).forEach((state) => {
                    if (systemState[state].event === savedSetpoint) {
                      systemState[state].setpoint = savedSetpoints[savedSetpoint].setpoint;
                    }
                  });
                });
              }
            });
          }
        });
      });
    },
  };
}

module.exports = (container) => {
  container.service('setpointSaver', setpointSaver, 'env', 'logger');
};
