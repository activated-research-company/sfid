function modeService(eventEmitter) {
  const modes = ['ready', 'analyze', 'shutdown', 'components'];
  let currentMode = '';
  let inProcessMode = '';
  let progress = 1;
  let maxProgress = 1;
  let currentStep = '';
  let emitInterval;

  function clearInProcessMode() {
    inProcessMode = '';
    progress = 1;
    maxProgress = 1;
    currentStep = '';
  }

  function clearModes() {
    currentMode = '';
    progress = maxProgress;
    clearInProcessMode();
  }

  function onModeStarted(newInProcessMode, newMaxProgress) {
    inProcessMode = newInProcessMode;
    progress = 0;
    maxProgress = newMaxProgress;
  }

  function onComplete() {
    currentMode = inProcessMode;
    progress = maxProgress;
    clearInProcessMode();
  }

  function emitMode() {
    eventEmitter.emit('mode', {
      current: currentMode,
      inProcess: inProcessMode,
      progress: parseFloat((progress / maxProgress).toFixed(2), 10),
      step: currentStep,
    });
  }

  function onStep(step) {
    currentStep = step;
    emitMode();
  }

  function onProgress(realProgress) {
    if (realProgress) {
      progress = realProgress;
    } else {
      progress += 1;
    }
    emitMode();
  }

  function onStop() {
    currentMode = '';
    clearInProcessMode();
  }

  function stopInProcessMode() {
    eventEmitter.emit(`${inProcessMode}.stop`);
    clearInProcessMode();
  }

  function listenToModeEvents() {
    modes.forEach((mode) => {
      eventEmitter
        .on(`${mode}.started`, (stages) => onModeStarted(mode, stages))
        .on(`${mode}.step`, onStep)
        .on(`${mode}.progress`, onProgress)
        .on(`${mode}.complete`, onComplete)
        .on(`${mode}.stop`, onStop);
    });
  }

  function listen() {
    listenToModeEvents();
    eventEmitter
      .on('mode.stop', stopInProcessMode)
      .on('emergencyshutdown', clearModes);
    emitInterval = setInterval(emitMode, 1000);
  }

  function stopListening() {
    clearInterval(emitInterval);
  }

  return {
    listen,
    stopListening,
  };
}

module.exports = (container) => {
  container.service('modeService', modeService, 'eventEmitter');
};
