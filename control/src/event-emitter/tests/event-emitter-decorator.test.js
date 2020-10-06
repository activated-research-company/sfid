const o = require('ospec');
const getNewEventEmitterDecorator = require('../event-emitter-decorator');

o.spec('event emitter decorator', () => {
  let emit;
  let eventEmitterMock;
  let onAll;
  let eventMock;
  let argsMock;
  let eventEmitterDecorator;

  o.beforeEach(() => {
    emit = o.spy();
    eventEmitterMock = {
      emit,
    };
    onAll = o.spy();
    eventMock = 'mock event';
    argsMock = { argMock: 'mock arg' };

    eventEmitterDecorator = getNewEventEmitterDecorator();
  });

  o('should decorate event emitter with onAll', () => {
    eventEmitterDecorator.decorate(eventEmitterMock);
    eventEmitterMock.all(onAll);
    eventEmitterMock.emit(eventMock, argsMock);

    o(onAll.callCount).equals(1);
    o(onAll.args[0]).equals(eventMock);
    o(onAll.args[1]).equals(argsMock);
    o(emit.callCount).equals(1);
    o(emit.args[0]).equals(eventMock);
    o(emit.args[1]).equals(argsMock);
  });
});
