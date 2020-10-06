const o = require('ospec');
const Bottle = require('bottlejs');
const registerComputerInformationService = require('../computer-information-service');

o.spec('computer information service', () => {
  let bottle;
  let computerInformationService;

  function getNewAutoResolvingPromise() {
    return new Promise((resolve) => resolve());
  }

  function computerInformationFactoryMock() {
    return {
      time: o.spy(),
      cpuTemperature: o.spy(getNewAutoResolvingPromise),
      currentLoad: o.spy(getNewAutoResolvingPromise),
      mem: o.spy(getNewAutoResolvingPromise),
    };
  }

  function eventEmitterFactoryMock() {
    return {
      emit: o.spy(),
    };
  }

  o.beforeEach(() => {
    bottle = new Bottle();
    bottle.service('computerInformation', computerInformationFactoryMock);
    bottle.service('eventEmitter', eventEmitterFactoryMock);
    registerComputerInformationService(bottle);

    computerInformationService = bottle.container.computerInformationService;
  });

  o.afterEach(() => {
    computerInformationService.stopListening();
  });

  function getEmitCount(emits, event) {
    let eventEmitCount = 0;
    emits.forEach((emit) => {
      eventEmitCount += emit.args[0] === event ? 1 : 0;
    });
    return eventEmitCount;
  }

  function getComputerInformationEmitCountEquals(getter, event, count) {
    o(getter.callCount).equals(count);
    o(getEmitCount(bottle.container.eventEmitter.emit.calls, event)).equals(count);
  }

  function testComputerInformationEmitCount(getter, event, done) {
    o.timeout(2500);
    computerInformationService.listen();
    setTimeout(() => {
      getComputerInformationEmitCountEquals(getter, event, 1);
    }, 1250);
    setTimeout(() => {
      getComputerInformationEmitCountEquals(getter, event, 2);
      done();
    }, 2250);
  }

  o('should emit time every second', (done) => {
    testComputerInformationEmitCount(
      bottle.container.computerInformation.time,
      'computer.time',
      () => (done)(),
    );
  });

  o('should emit temperature every second', (done) => {
    testComputerInformationEmitCount(
      bottle.container.computerInformation.cpuTemperature,
      'computer.temperature',
      () => (done)(),
    );
  });

  o('should emit cpu every second', (done) => {
    testComputerInformationEmitCount(
      bottle.container.computerInformation.currentLoad,
      'computer.cpu',
      () => (done)(),
    );
  });

  o('should emit memory every second', (done) => {
    testComputerInformationEmitCount(
      bottle.container.computerInformation.mem,
      'computer.memory',
      () => (done)(),
    );
  });

  o('should emit four events per second', (done) => {
    o.timeout(2500);
    computerInformationService.listen();
    setTimeout(() => {
      o(bottle.container.eventEmitter.emit.callCount).equals(4);
    }, 1250);
    setTimeout(() => {
      o(bottle.container.eventEmitter.emit.callCount).equals(8);
      (done)();
    }, 2250);
  });
});
