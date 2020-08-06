const Delimiter = require('@serialport/parser-delimiter');

const serialDeviceReconnectInterval = 2000;

// TODO: this should be a factory instead of a class
class SerialDevice {
  constructor(serialDevice, serialPortFactory, eventEmitter) {
    if (serialDevice) {
      this.serialDevice = serialDevice;
      this.serialPortFactory = serialPortFactory;
      this.parser = new Delimiter({ delimiter: serialDevice.delimiter });
      this.connected = false;
      eventEmitter.on(serialDevice.onFoundEvent, this.connect.bind(this));
    }
  }

  send(message) {
    if (this.connected) { this.serialPort.write(message); }
  }

  connect() {
    return new Promise((resolve) => {
      this.serialPort = this.serialPortFactory.getNewSerialPort(
        this.serialDevice.port,
        {
          baudRate: this.serialDevice.baudRate,
          autoOpen: false,
        },
      );

      this.parser = this.serialPort.pipe(this.parser);

      this.serialPort.on('open', () => {
        this.connected = true;
      });
      this.serialPort.on('close', () => {
        this.connected = false;
        setTimeout(this.reconnect.bind(this), serialDeviceReconnectInterval);
      });
      this.serialPort.on('error', () => {
        setTimeout(this.reconnect.bind(this), serialDeviceReconnectInterval);
      });

      this.serialPort.open();

      resolve(this.parser);
    });
  }

  reconnect() {
    if (!this.connected) { this.serialPort.open(); }
  }
}

module.exports = SerialDevice;
