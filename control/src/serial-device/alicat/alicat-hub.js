const SerialDevice = require('../serial-device');

class AlicatHub extends SerialDevice {
  constructor(serialDevice, serialPortFactory, eventEmitter, controllers, state) {
    super(serialDevice, serialPortFactory, eventEmitter);

    controllers.forEach((controller) => {
      eventEmitter.on(`set${controller.event}`, (value) => {
        controller.set(value, (translatedValue) => {
          this.pushCommand(`${controller.address}s${translatedValue}`);
        });
      });
    });

    this.controllers = controllers;
    this.commandStack = [];
    this.eventEmitter = eventEmitter;
    this.state = state;
  }

  pushGlobalCommand(command) {
    this.controllers.forEach((controller) => {
      this.pushCommand(`${controller.address}${command}`);
    });
  }

  pushCommand(message) {
    this.commandStack.push(`${message}\r`);
  }

  connect() {
    return super.connect().then((parser) => {
      if (parser) {
        parser.on('data', (data) => {
          const json = AlicatHub.dataToJson(data);
          this.state.next({ type: json.gas, payload: json})
          this.controllers.forEach((controller) => {
            if (controller.address === json.id) {
              this.eventEmitter.emit(controller.event.toLowerCase(), controller.get(json));
            }
          });
          this.sendNextCommand();
        });
      }
      setInterval(() => this.sendNextCommand(), 500);
    });
  }

  sendNextCommand() {
    if (this.commandStack.length === 0) {
      this.pushGlobalCommand('');
    } else {
      super.send(this.commandStack.shift());
    }
  }

  static dataToJson(data) {
    const dataArray = data.toString().split(' ');
    return {
      id: dataArray[0].toLowerCase(),
      pressure: dataArray[1],
      temperature: dataArray[2],
      flow: dataArray[4],
      setpoint: parseFloat(dataArray[5], 10) || 0,
      gas: dataArray[9],
    };
  }
}

module.exports = AlicatHub;
