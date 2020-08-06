function phidgetManager({ phidget }, phidget22, logger) {
  let connection;
  let manager;

  function connect() {
    if (!phidget.useSim) {
      connection = new phidget22.Connection(
        phidget.port,
        phidget.host,
      );
      return connection.connect().then(() => {
        manager = new phidget22.Manager();
        manager.open();
      }).catch((err) => {
        logger.error(err);
      });
    }
  }

  return {
    connect,
  };
}

module.exports = phidgetManager;
