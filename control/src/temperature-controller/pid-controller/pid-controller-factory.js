function getPidControllerFactory(PidController, eventEmitter, settings) {
  function getNewPidController(identifier) {
    function getPidPropertyName(term) { return `${identifier}K${term}`; }
    function getPidSetting(term) { return settings[getPidPropertyName(term)]; }

    const pidController = new PidController(getPidSetting('p'), getPidSetting('i'), getPidSetting('d'));

    function updatePidSetting(term, value) {
      settings[getPidPropertyName(term)] = value;
      pidController[`k_${term}`] = value;
      pidController.reset();
    }

    function setKp(value) { updatePidSetting('p', value); }
    function setKi(value) { updatePidSetting('i', value); }
    function setKd(value) { updatePidSetting('d', value); }

    eventEmitter.on(`set${identifier}kp`, setKp);
    eventEmitter.on(`set${identifier}ki`, setKi);
    eventEmitter.on(`set${identifier}kd`, setKd);

    return pidController;
  }

  return {
    getNewPidController,
  };
}

module.exports = (container) => {
  container.service(
    'pidControllerFactory',
    getPidControllerFactory,
    'PidController',
    'eventEmitter',
    'settings',
  );
};
