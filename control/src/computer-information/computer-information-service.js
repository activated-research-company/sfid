const http = require('http');

function computerInformationService(computerInformation, eventEmitter, env) {
  const START_DATE = new Date();
  const dataInterval = 60000;
  const intervals = [];

  function monitor(attribute, getter, interval) {
    intervals.push(
      setInterval(() => {
        getter(interval || dataInterval).then((data) => {
          eventEmitter.emit(`computer.${attribute}`, data);
        });
      },
      interval || dataInterval),
    );
  }

  function getTime(sampleRate) {
    if (env.startup.useSim) {
      return new Promise((resolve) => {
        resolve({
          actual: Math.floor((new Date().getTime() - START_DATE.getTime()) / 1000),
          sampleRate,
        });
      });
    }
    return new Promise((resolve) => {
      resolve({
        actual: computerInformation.time().uptime,
        sampleRate,
      });
    });
  }

  function getTemperature(sampleRate) {
    return computerInformation
      .cpuTemperature()
      .then(({ max }) => {
        return { actual: max, sampleRate };
      });
  }

  function getCpu(sampleRate) {
    return computerInformation
      .currentLoad()
      .then(({ currentload }) => {
        return { actual: currentload, sampleRate };
      })
  }

  function getMemory(sampleRate) {
    return computerInformation
      .mem()
      .then((args) => {
        return {
          actual: (args.used / args.total) * 100,
          sampleRate,
        };
      });
  }

  function getFsSize(sampleRate) {
    return computerInformation
      .fsSize()
      .then((fs) => fs.reduce((total, media) => {
        return { size: total.size + media.size };
      }))
      .then(({ size }) => {
        return { actual: size / 1073741824, sampleRate };
      });
  }

  function getFsUsed(sampleRate) {
    return computerInformation
      .fsSize()
      .then((fs) => fs.reduce((total, media) => {
        return { used: total.used + media.used };
      }))
      .then(({ used }) => {
        return { actual: used / 1073741824, sampleRate };
      });
  }

  function getIp(sampleRate) {
    if (env.balena.supervisor.address) {
      return new Promise((resolve) => {
        http
          .get(
            `${env.balena.supervisor.address}/v1/device?apikey=${env.balena.supervisor.apiKey}`,
            (res) => {
              let data = "";

              res.on("data", d => {
                data += d;
              })
              res.on("end", () => {
                const json = JSON.parse(data);
                resolve({ actual: json.ip_address.split(' ')[0], sampleRate });
              });
            }
          )
          .end();
      });
    } else {
      return computerInformation
        .networkInterfaces()
        .then((interfaces) =>{
          return interfaces.find((interface) => {
            return interface.operstate === 'up';
          });
        })
        .then((interface) => {
          if (interface) { return { actual: interface.ip4, sampleRate }; }
          return { actual: '', sampleRate };
        });
    }
  }

  function listen() {
    monitor('time', getTime, 1000);
    monitor('temperature', getTemperature);
    monitor('cpu', getCpu);
    monitor('memory', getMemory);
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
