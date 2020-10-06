function envLogger(env, logger) {
  logger.verbose(JSON.stringify(env, null, 2));
}

module.exports = (container) => {
  container.service(
    'envLogger',
    envLogger,
    'env',
    'logger',
  );
};
