function getDecorator(eventEmitter, logger) {
  function decorate(stage) {
    const decoratedStage = stage;

    let setpoints = {};
    let stopped = true;
    let checkIfStageIsCompleteInterval;
    let remainingSteps;

    function removeNonApplicableOrCompleteSteps(step) {
      return (!step.applies || step.applies()) && !step.isComplete();
    }

    function thereAreRemainingSteps() { return remainingSteps && remainingSteps.length; }

    function emitStep(step) {
      eventEmitter.emit(`${decoratedStage.mode}.step`, step && step.description ? `${step.description}...` : '');
    }

    function emitCurrentStep() {
      if (thereAreRemainingSteps()) {
        remainingSteps = remainingSteps.filter(removeNonApplicableOrCompleteSteps);
        if (thereAreRemainingSteps()) {
          emitStep(remainingSteps[0]);
        }
      } else {
        emitStep();
      }
    }

    function completeStage() {
      logger.debug(`${decoratedStage.mode} stage ${decoratedStage.stage} complete`);
      clearInterval(checkIfStageIsCompleteInterval);
      eventEmitter.emit(`${decoratedStage.mode}.progress`);
      eventEmitter.emit(`${decoratedStage.mode}.stage${decoratedStage.stage}complete`, setpoints);
      eventEmitter.emit(`${decoratedStage.mode}.step`, '');
      if (decoratedStage.last) {
        logger.info(`${decoratedStage.mode} complete`);
        eventEmitter.emit(`${decoratedStage.mode}.complete`);
      }
    }

    function checkIfStageIsComplete() {
      if ((decoratedStage.last && decoratedStage.isComplete()) || (!decoratedStage.last && !thereAreRemainingSteps())) {
        // TODO: move everything to step based completion
        completeStage();
      } else {
        emitCurrentStep();
      }
    }

    function logStageStarted() {
      logger.debug(`${decoratedStage.mode} stage ${decoratedStage.stage} started`);
    }

    function stop() {
      stopped = true;
      clearInterval(checkIfStageIsCompleteInterval);
      if (decoratedStage.stop) { decoratedStage.stop(); }
      if (decoratedStage.last) { logger.info(`${decoratedStage.mode} stopped`); }
    }

    function start() {
      if (!stopped) {
        logStageStarted();
        remainingSteps = decoratedStage.steps;
        emitCurrentStep();
        if (decoratedStage.start) { decoratedStage.start(setpoints); }
        checkIfStageIsCompleteInterval = setInterval(checkIfStageIsComplete, 250);
      }
    }

    function listenToStartEvent() {
      let startEvent = `${decoratedStage.mode}.`;
      if (decoratedStage.first) {
        startEvent += 'start';
      } else {
        startEvent += `stage${decoratedStage.stage - 1}complete`;
      }
      eventEmitter.on(startEvent, (args) => {
        if (decoratedStage.first) {
          logger.info(`${decoratedStage.mode}`);
          eventEmitter.emit(`${decoratedStage.mode}.started`, decoratedStage.stages);
        }
        setpoints = args;
        stopped = false;
        start();
      });
    }

    function registerListeners() {
      if (decoratedStage.listeners) {
        decoratedStage.listeners.forEach((listener) => {
          eventEmitter.on(listener.event, (args) => {
            listener.handler(args, setpoints);
          });
        });
      }
    }

    function listenToStopEvent() {
      eventEmitter.on(`${decoratedStage.mode}.stop`, stop);
      eventEmitter.on('emergencyshutdown', stop);
    }

    function listen() {
      listenToStartEvent();
      registerListeners();
      listenToStopEvent();
    }

    listen();

    return decoratedStage;
  }

  return decorate;
}

module.exports = (container) => {
  container.decorator('fidStageOne', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('fidStageTwo', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('fidStageThree', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('fidStageFour', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('fidStageComplete', getDecorator(container.container.eventEmitter, container.container.logger));

  container.decorator('standbyStageOne', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('standbyStageTwo', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('standbyStageThree', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('standbyStageFour', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('standbyStageComplete', getDecorator(container.container.eventEmitter, container.container.logger));

  container.decorator('analyzeStageOne', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('analyzeStageTwo', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('analyzeStageThree', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('analyzeStageFour', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('analyzeStageComplete', getDecorator(container.container.eventEmitter, container.container.logger));

  container.decorator('shutdownStageOne', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('shutdownStageTwo', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('shutdownStageThree', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('shutdownStageFour', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('shutdownStageFive', getDecorator(container.container.eventEmitter, container.container.logger));
  container.decorator('shutdownStageComplete', getDecorator(container.container.eventEmitter, container.container.logger));
};
