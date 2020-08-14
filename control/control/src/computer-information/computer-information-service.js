function computerInformationService(computerInformation, eventEmitter, env) {
  const START_DATE = new Date();
  const dataInterval = 1000;
  const intervals = [];

  function monitor(attribute, getter) {
    intervals.push(
      setInterval(() => {
        getter().then((data) => {
          eventEmitter.emit(`computer.${attribute}`, data);
        });
      },
      dataInterval),
    );
  }

  function getTime() {
    if (env.startup.useSim) {
      return new Promise((resolve) => {
        resolve({
          uptime: Math.floor((new Date().getTime() - START_DATE.getTime()) / 1000),
        });
      });
    }
    return new Promise((resolve) => {
      resolve(computerInformation.time());
    });
  }

  function getFsSize() {
    return computerInformation
      .fsSize()
      .then((fs) => fs.reduce((total, media) => {
        return { size: total.size + media.size };
      }).size);
  }

  function getFsUsed() {
    return computerInformation.fsSize().then((fs) => {
      return fs.reduce((total, media) => {
        return { used: total.used + media.used };
      }).used;
    });
  }

  function getIp() {
    return computerInformation
      .networkInterfaces()
      .then((interfaces) =>{
        return interfaces.find((interface) => {
          return interface.operstate === 'up';
        });
      })
      .then((interface) => {
        if (interface) { return interface.ip4; }
        return '';
      });
  }

  function listen() {
    monitor('time', getTime);
    monitor('temperature', computerInformation.cpuTemperature);
    monitor('cpu', computerInformation.currentLoad);
    monitor('memory', computerInformation.mem);
    monitor('fssize', getFsSize);
    monitor('fsused', getFsUsed);
    monitor('ip', getIp);
  }

  function stopListening() {
    intervals.forEach((interval) => { clearInterval(interval); });
  }

  return {
    listen,
    stopListening,
  };
}

module.exports = (container) => {
  container.service(
    'computerInformationService',
    computerInformationService,
    'computerInformation',
    'eventEmitter',
    'env',
  );
};
