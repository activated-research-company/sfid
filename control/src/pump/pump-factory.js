function pumpFactory(digitalOutputFactory, eventEmitter) {
  function getNewPump(hub, port) {
    const id = 'diversionvalve';

    const relay = digitalOutputFactory.getNewDigitalOutput(
      hub,
      port,
      true,
      0,
      id,
    );
    let emitInterval;

    function start() { relay.setOutput(1); }
    function stop() { relay.setOutput(0); }

    function emit() {
      eventEmitter.emit('pump', relay.getOutput() === 1);
    }

    function startEmitting() {
      emitInterval = setInterval(emit, 500);
    }

    function stopEmitting() {
      clearInterval(emitInterval);
    }

    function setPump(position) {
      if (position === '1') {
        start();
      } else {
        stop();
      }
    }

    function listen() {
      relay
        .connect()
        .then(() => {
          stop();
          eventEmitter.emit('pumpfound');
          eventEmitter.on('setpump', setPump);
          startEmitting();
        });
    }

    function stopListening() {
      eventEmitter.off('setpump', setPump);
      stopEmitting();
    }

    return {
      listen,
      stopListening,
    };
  }

  return {
    getNewPump,
  };
}

module.exports = pumpFactory;
