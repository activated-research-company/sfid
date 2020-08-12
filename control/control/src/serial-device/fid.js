const SerialDevice = require('./serial-device');

class Fid extends SerialDevice {
  constructor(serialPortFactory, { fid }, sampleRate, influx, eventEmitter, state) {
    super(fid, serialPortFactory, eventEmitter);
    eventEmitter.on('setfidigniter', this.ignite.bind(this));
    this.sampleRate = sampleRate;
    this.influx = influx;
    this.eventEmitter = eventEmitter;
    this.state = state;
    this.commands = 0;
    this.igniting = false;
    this.ignited = false;
  }

  sendCommand() {
    if (this.commands >= 4 || !this.temperature) {
      this.command = 'LL';
      this.commands = 0;
    } else {
      this.command = 'RD';
      this.commands += 1;
    }
    super.send(`${this.command}\r\n`);
  }

  connect() {
    return super.connect().then((parser) => {
      setInterval(this.emitFidIgniter.bind(this), 1000);
      if (parser) {
        parser.on('data', (data) => {
          const json = this.dataToJson(data);
          if (json) {
            this.eventEmitter.emit('fid', json);
            this.state.next({ type: 'fid', payload: json });
            if (this.influx.writePoints && json.voltage) {
              this.influx.writePoints(
                [
                  {
                    measurement: 'fid',
                    fields: {
                      voltage: json.voltage,
                    },
                    tags: {
                      flame: this.ignited ? '1' : '0',
                    },
                  },
                ],
                {
                  database: 'solvere',
                  precision: 'ms',
                },
              )
                .catch((error) => {
                  console.error(error.stack);
                });
            }
          }
        });
        setInterval(this.sendCommand.bind(this), this.sampleRate);
      }
    });
  }

  emitFidIgniter() {
    this.eventEmitter.emit('fidigniter', this.igniting);
    this.eventEmitter.emit('fidignited', this.ignited);
  }

  turnOffIgniter() {
    if (this.igniting) {
      super.send('IG OFF\r\n');
      this.igniting = false;
    }
  }

  ignite() {
    this.igniting = true;
    super.send('IG ON\r\n');
    setTimeout(this.turnOffIgniter.bind(this), 5000);
  }

  dataToJson(data) {
    // TODO: figure out why some of these data array indexes are coming back null
    const dataArray = data.toString().split(' ').filter((e) => e !== '');
    if (dataArray[0] === 'Ignitor') { return null; }
    if (this.command === 'RD') {
      if (dataArray[0] === 'Measured') { return null; }
      if (dataArray[4]) { this.voltage = -parseFloat(dataArray[4].slice(0, -1)) * 1000; }
    }
    if (this.command === 'LL') {
      if (dataArray[0] === 'Input') { return null; }
      if (dataArray[1]) { this.voltage = -parseFloat(dataArray[1]) * 1000; }
      if (dataArray[3]) { this.temperature = parseFloat(dataArray[3]); }
      this.ignited = this.temperature >= 70;
      if (this.igniting && this.ignited) {
        super.send('IG OFF\r\n');
        this.igniting = false;
      }
    }
    return {
      voltage: parseFloat(this.voltage.toFixed(4)),
      temperature: this.temperature,
      sampleRate: this.sampleRate,
    };
  }
}

module.exports = Fid;
