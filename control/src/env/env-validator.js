
function envValidator(env) {
  function notConfigured(message) {
    throw new Error(`${message} is not configured`);
  }
  const isUndefined = (value) => typeof value === 'undefined';

  function validateHubConfigured(key) {
    if (!env[key]) { notConfigured(key); }
    if (isUndefined(env[key].hubLabel) || Number.isNaN(env[key].hubLabel)) { notConfigured(`${key} hub label`); }
    if (isUndefined(env[key].hubPort) || Number.isNaN(env[key].hubPort)) { notConfigured(`${key} hub port`); }
  }

  // validateHubConfigured('fidTemperatureSensor');
  // validateHubConfigured('cellTemperatureSensor');
  // validateHubConfigured('heater');
  // validateHubConfigured('leakDetector');
  // validateHubConfigured('encoder');
  // validateHubConfigured('redIndicatorLight');
  // validateHubConfigured('orangeIndicatorLight');
  // validateHubConfigured('greenIndicatorLight');
  // validateHubConfigured('diversionValvePosition');
  // validateHubConfigured('diversionValveControl');
}

module.exports = (container) => {
  container.service(
    'envValidator',
    envValidator,
    'env',
    'logger', // make sure the logger is created first
  );
};
