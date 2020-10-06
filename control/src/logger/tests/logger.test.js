const o = require('ospec');
const getNewLogger = require('../logger');

const mockMessage = 'message';
const mockColorizedMessage = 'colorized message';

o.spec('logger', () => {
  let env;
  let output;
  let colorizer;
  let logger;

  o.beforeEach(() => {
    env = {};
    output = {
      debug: o.spy(),
      info: o.spy(),
      warn: o.spy(),
      error: o.spy(),
      log: o.spy(),
    };
    function colorize() {
      return mockColorizedMessage;
    }
    colorizer = {
      magenta: o.spy(colorize),
      blue: o.spy(colorize),
      yellow: o.spy(colorize),
      red: o.spy(colorize),
      green: o.spy(colorize),
    };
    logger = getNewLogger(env, output, colorizer);
  });

  o('debug should use magenta output.debug', () => {
    env.logLevel = '3';

    logger.debug(mockMessage);

    o(colorizer.magenta.callCount).equals(1);
    o(colorizer.magenta.args[0].includes(mockMessage)).equals(true);
    o(output.debug.callCount).equals(1);
    o(output.debug.args[0].includes(mockColorizedMessage)).equals(true);
  });

  o('info should use blue output.info', () => {
    env.logLevel = '2';

    logger.info(mockMessage);

    o(colorizer.blue.callCount).equals(1);
    o(colorizer.blue.args[0].includes(mockMessage)).equals(true);
    o(output.info.callCount).equals(1);
    o(output.info.args[0].includes(mockColorizedMessage)).equals(true);
  });

  o('warn should use yellow output.warn', () => {
    env.logLevel = '1';

    logger.warn(mockMessage);

    o(colorizer.yellow.callCount).equals(1);
    o(colorizer.yellow.args[0].includes(mockMessage)).equals(true);
    o(output.warn.callCount).equals(1);
    o(output.warn.args[0].includes(mockColorizedMessage)).equals(true);
  });

  o('error should use red output.error', () => {
    env.logLevel = '1';

    logger.error(mockMessage);

    o(colorizer.red.callCount).equals(1);
    o(colorizer.red.args[0].includes(mockMessage)).equals(true);
    o(output.error.callCount).equals(1);
    o(output.error.args[0].includes(mockColorizedMessage)).equals(true);
  });

  o('log should use green output.log', () => {
    env.logLevel = '0';

    logger.log(mockMessage);

    o(colorizer.green.callCount).equals(1);
    o(colorizer.green.args[0].includes(mockMessage)).equals(true);
    o(output.log.callCount).equals(1);
    o(output.log.args[0].includes(mockColorizedMessage)).equals(true);
  });


  o('should fully log with level 3', () => {
    env.logLevel = '3';

    logger.debug(mockMessage);
    logger.info(mockMessage);
    logger.warn(mockMessage);
    logger.error(mockMessage);
    logger.log(mockMessage);

    o(output.debug.callCount).equals(1);
    o(output.info.callCount).equals(1);
    o(output.warn.callCount).equals(1);
    o(output.error.callCount).equals(1);
    o(output.log.callCount).equals(1);
  });

  o('should info and up with level 2', () => {
    env.logLevel = '2';

    logger.debug(mockMessage);
    logger.info(mockMessage);
    logger.warn(mockMessage);
    logger.error(mockMessage);
    logger.log(mockMessage);

    o(output.debug.callCount).equals(0);
    o(output.info.callCount).equals(1);
    o(output.warn.callCount).equals(1);
    o(output.error.callCount).equals(1);
    o(output.log.callCount).equals(1);
  });

  o('should warn and up with level 1', () => {
    env.logLevel = '1';

    logger.debug(mockMessage);
    logger.info(mockMessage);
    logger.warn(mockMessage);
    logger.error(mockMessage);
    logger.log(mockMessage);

    o(output.debug.callCount).equals(0);
    o(output.info.callCount).equals(0);
    o(output.warn.callCount).equals(1);
    o(output.error.callCount).equals(1);
    o(output.log.callCount).equals(1);
  });

  o('should error and log with level 0', () => {
    env.logLevel = '0';

    logger.debug(mockMessage);
    logger.info(mockMessage);
    logger.warn(mockMessage);
    logger.error(mockMessage);
    logger.log(mockMessage);

    o(output.debug.callCount).equals(0);
    o(output.info.callCount).equals(0);
    o(output.warn.callCount).equals(0);
    o(output.error.callCount).equals(1);
    o(output.log.callCount).equals(1);
  });
});
