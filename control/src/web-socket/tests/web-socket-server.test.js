const o = require('ospec');
const getNewWebSocketServer = require('../web-socket-server');

o.spec('web socket server', () => {
  let envMock;
  let ipAddressMock;
  let serverMock;
  let webSocketMock;
  let eventEmitterMock;
  let loggerMock;
  let webSocketServer;

  const localhostLong = '::ffff:127.0.0.1';
  const localhostShort = '127.0.0.1';
  const external = '123.4.5.6';
  const eventMock = 'mock event';
  const argsMock = { propertyMock: 'mock value' };
  let localClientMock;
  let externalClientMock;

  o.beforeEach(() => {
    envMock = {};
    ipAddressMock = '192.168.1.1';
    serverMock = {
      listen: o.spy(),
    };
    webSocketMock = {
      on: o.spy((event, handler) => {
        webSocketMock[`${event}Handler`] = handler;
      }),
      emit: o.spy(),
    };
    eventEmitterMock = {
      all: o.spy((handler) => {
        eventEmitterMock.allHandler = handler;
      }),
      emit: o.spy(),
    };
    loggerMock = {
      debug: o.spy(),
      info: o.spy(),
    };
    localClientMock = {
      handshake: { address: localhostLong },
      on: o.spy((event, handler) => {
        localClientMock[`${event}Handler`] = handler;
      }),
      disconnect: o.spy(),
    };
    externalClientMock = {
      handshake: { address: external },
      on: o.spy((event, handler) => {
        externalClientMock[`${event}Handler`] = handler;
      }),
      disconnect: o.spy(),
    };

    webSocketServer = getNewWebSocketServer(
      envMock,
      ipAddressMock,
      serverMock,
      webSocketMock,
      eventEmitterMock,
      loggerMock,
    );
  });

  o('contains all incoming events', () => {
    // TODO: make sure this contains all events and force count check
    o(webSocketServer.events.hydrogen).equals('hydrogen');
    o(webSocketServer.events.air).equals('air');
    o(webSocketServer.events.fidTemperature).equals('fidtemperature');
    o(webSocketServer.events.fidKp).equals('fidkp');
    o(webSocketServer.events.fidKi).equals('fidki');
    o(webSocketServer.events.fidKd).equals('fidkd');
    o(webSocketServer.events.fidIgniter).equals('fidigniter');
    o(webSocketServer.events.emergencyShutdown).equals('enableemergencyshutdown');
    o(Object.keys(webSocketServer.events).length).equals(21);
  });

  o('events should be lowercase', () => {
    Object.keys(webSocketServer.events).forEach((event) => {
      o(webSocketServer.events[event]).equals(webSocketServer.events[event].toLowerCase());
    });
  });

  o('should log.debug new connection attempt', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    o(loggerMock.debug.calls[0].args[0]).equals(`${localhostShort} connecting`);
  });

  o('should log.debug has access for localhost', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    o(loggerMock.debug.calls[1].args[0]).equals(`${localhostShort} has access`);
  });

  o('should not log.debug has access for external when not in remote control', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(externalClientMock);
    o(loggerMock.debug.callCount).equals(1);
    o(loggerMock.debug.calls[0].args[0]).equals(`${external} connecting`);
  });

  o('should register remote events for localhost', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    o(localClientMock.on.callCount).equals(4 + Object.keys(webSocketServer.events).length);
    o(localClientMock.on.calls[0].args[0]).equals('disconnect');
    o(localClientMock.on.calls[1].args[0]).equals('remote');
    o(localClientMock.on.calls[2].args[0]).equals('remotecontrol');
  });

  o('does not grant control to external when not remote controlling', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(externalClientMock);
    o(externalClientMock.on.callCount).equals(1);
    o(externalClientMock.on.calls[0].args[0]).equals('disconnect');
  });

  o('does not register remote events for external with remote control', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.remotecontrolHandler(true);

    webSocketMock.connectHandler(externalClientMock);

    o(loggerMock.info.callCount).equals(2);
    o(loggerMock.info.calls[0].args[0]).equals('ip mode on');
    o(loggerMock.info.calls[1].args[0]).equals(`${external} has remote control`);
    o(externalClientMock.on.callCount).equals(3 + Object.keys(webSocketServer.events).length);
    externalClientMock.on.calls.forEach((call) => {
      o(call.args[0]).notEquals('remote');
      o(call.args[0]).notEquals('remotecontrol');
    });
    o(webSocketMock.emit.callCount).equals(2);
    o(webSocketMock.emit.calls[0].args[0]).equals('remote');
    o(webSocketMock.emit.calls[0].args[1].ipAddress).equals(ipAddressMock);
    o(webSocketMock.emit.calls[0].args[1].remoteControl).equals(true);
    o(webSocketMock.emit.calls[0].args[1].remoteIpAddress).equals(null);
    o(webSocketMock.emit.calls[1].args[0]).equals('remoteconnected');
    o(webSocketMock.emit.calls[1].args[1]).equals(external);
  });

  o('should emit remote status without remote control', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);

    localClientMock.remoteHandler();

    o(webSocketMock.emit.calls[0].args[0]).equals('remote');
    o(webSocketMock.emit.calls[0].args[1].ipAddress).equals(ipAddressMock);
    o(webSocketMock.emit.calls[0].args[1].remoteControl).equals(false);
    o(webSocketMock.emit.calls[0].args[1].remoteIpAddress).equals(null);
  });

  o('should emit remote status with remote control', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.remotecontrolHandler(true);
    webSocketMock.connectHandler(externalClientMock);

    localClientMock.remoteHandler();

    o(webSocketMock.emit.calls[2].args[0]).equals('remote');
    o(webSocketMock.emit.calls[2].args[1].ipAddress).equals(ipAddressMock);
    o(webSocketMock.emit.calls[2].args[1].remoteControl).equals(true);
    o(webSocketMock.emit.calls[2].args[1].remoteIpAddress).equals(external);
  });

  o('should disconnect external with remote control when remote control is disabled', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.remotecontrolHandler(true);
    webSocketMock.connectHandler(externalClientMock);

    localClientMock.remotecontrolHandler(false);

    o(loggerMock.info.calls[2].args[0]).equals('ip mode off');
    o(externalClientMock.disconnect.callCount).equals(1);
    o(externalClientMock.disconnect.args[0]).equals(true);
  });

  o('should echo event emitter to web socket', () => {
    webSocketServer.listen();
    eventEmitterMock.allHandler(eventMock, argsMock);
    o(eventEmitterMock.all.callCount).equals(1);
    o(webSocketMock.emit.callCount).equals(1);
    o(webSocketMock.emit.args[0]).equals(eventMock);
    o(webSocketMock.emit.args[1]).equals(argsMock);
  });

  o('should log.debug local client disconnect', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.disconnectHandler();
    o(loggerMock.debug.args[0]).equals(`${localhostShort} disconnected`);
  });

  o('should emit and log.info external client disconnect', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.remotecontrolHandler(true);
    webSocketMock.connectHandler(externalClientMock);
    externalClientMock.disconnectHandler();
    o(webSocketMock.emit.args[0]).equals('remotedisconnected');
    o(loggerMock.info.calls[2].args[0]).equals(`${external} lost remote control`);
    o(loggerMock.debug.calls[4].args[0]).equals(`${external} disconnected`);
  });

  o('should emit cell air setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.cellairHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setcellair');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit cell temperature setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.celltemperatureHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setcelltemperature');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit disk rpm setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.diskrpmHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setdiskrpm');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit cell pressure setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.cellpressureHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setcellpressure');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit laser hard interlock setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.laserhardinterlockHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setlaserhardinterlock');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  }); // TODO: we shouldn't actually do anything with this

  o('should emit laser soft interlock setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.lasersoftinterlockHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setlasersoftinterlock');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit laser pilot setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.laserpilotHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setlaserpilot');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit laser power setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.laserpowerHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setlaserpower');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit fid hydrogen setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.hydrogenHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('sethydrogen');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit fid air setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.airHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setair');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });

  o('should emit fid temperature setter', () => {
    webSocketServer.listen();
    webSocketMock.connectHandler(localClientMock);
    localClientMock.fidtemperatureHandler(argsMock);

    o(eventEmitterMock.emit.callCount).equals(1);
    o(eventEmitterMock.emit.args[0]).equals('setfidtemperature');
    o(eventEmitterMock.emit.args[1]).equals(argsMock);
  });
});
