const random = require('../../utilitites/random');

function fidPortMock(eventEmitter) {

  let ignitionInterval;
  let airflow = 0;
  let hydrogenflow = 0;
  let temperature = 20.6;

  function checkIfFlameShouldBeExtinguished() {
    if (airflow / hydrogenflow > 10 || hydrogenflow < 35) {
      temperature = 20.6;
    }
  }

  eventEmitter.on('fidhydrogen', (args) => {
    hydrogenflow = parseFloat(args.actual);
    checkIfFlameShouldBeExtinguished();
  });

  eventEmitter.on('fidair', (args) => {
    airflow = parseFloat(args.actual);
    checkIfFlameShouldBeExtinguished();
  });

  function getResponse(message) {
    const parsedMessage = message.split('\r\n')[0];

    let volts;

    if (!this.peaking && random(1, 100) === 100) {
      this.peaking = true;
      this.peakHeight = random(50000, 900000) / 100000;
      this.peakDuration = random(2, 10);
      this.peakStep = 1;
      this.peakDirection = 1;
    }

    if (this.peaking) {
      volts = (this.peakHeight * (Math.abs(this.peakStep) / this.peakDuration)).toFixed(3);
      if (this.peakStep === this.peakDuration) {
        this.peakDirection = -1;
      }
      this.peakStep += this.peakDirection;
      this.peaking = this.peakStep > 0;
    } else {
      volts = random(12000, 12800) / 100000;
    }

    volts = -volts;

    if (parsedMessage === 'LL') {
      return `null ${volts} null ${temperature}\r\n`;
    }

    if (parsedMessage === 'RD') {
      return `null null null null ${volts}\r\n`;
    }

    if (parsedMessage === 'IG ON') {
      ignitionInterval = setInterval(() => {
        temperature += temperature;
      }, 500);
      return 'Ignitor ON';
    }

    if (parsedMessage === 'IG OFF') {
      clearInterval(ignitionInterval);
      return 'Ignitor OFF';
    }

    return 'Invalid command';
  }

  return {
    getResponse,
  };
}


module.exports = fidPortMock;
