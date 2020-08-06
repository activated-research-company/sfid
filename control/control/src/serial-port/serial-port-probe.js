const Delimiter = require('@serialport/parser-delimiter');

class SerialPortProbe {
  constructor(registryPort, port, serialPortFactory, eventEmitter, logger) {
    this.registryPort = registryPort;
    this.name = registryPort.name;
    this.port = port;

    this.serialPort = serialPortFactory.getNewSerialPort(this.port, {
      baudRate: this.registryPort.baudRate,
      autoOpen: false,
    });

    this.parser = this.serialPort.pipe(new Delimiter({ delimiter: this.registryPort.delimiter }));

    eventEmitter.on(this.registryPort.onFoundEvent, () => {
      clearTimeout(this.checkIfFoundTimeout);
      this.checkIfFound();
    });
    this.serialPort.on('open', this.onOpen.bind(this));
    this.parser.on('data', this.onData.bind(this));
    this.eventEmitter = eventEmitter;
    this.logger = logger;
  }

  sendProbe() {
    if (this.serialPort.isOpen) {
      this.isProbing = true;
      if (this.registryPort.probe) { this.serialPort.write(this.registryPort.probe); }
    }
  }

  onOpen() {
    setTimeout(this.sendProbe.bind(this), this.registryPort.probe ? 2000 : 0);
  }

  onData(data) {
    // TODO: rework this disgusting invalid command bandaid for the FID
    if (this.isProbing && (data.toString().trim() !== 'Invalid command' || this.name === 'fid')) {
      this.isProbing = false;
      this.logger.debug(`${this.name} @ ${this.port}`);
      this.registryPort.port = this.port;
      this.foundPort = true;
      this.serialPort.close();
      this.eventEmitter.emit(this.registryPort.onFoundEvent);
    }
  }

  probe(onNotFound) {
    this.onNotFound = onNotFound;
    setTimeout(() => {
      this.serialPort.open();
    }, 1000);
    this.checkIfFoundTimeout = setTimeout(this.checkIfFound.bind(this), 5000);
  }

  checkIfFound() {
    if (!this.foundPort) {
      if (this.serialPort.isOpen) { this.serialPort.close(); }
      setTimeout(this.onNotFound, 1000);
    }
  }
}

module.exports = SerialPortProbe;
