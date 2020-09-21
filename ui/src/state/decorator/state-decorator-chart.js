function getDecorator(eventEmitter) {
  function decorate(systemState) {
    const decoratedSystemState = systemState;
    function addChartMethod(state) {
      const decoratedState = state;

      decoratedState.chart = () => {
        eventEmitter.emit('chart', {
          title: decoratedState.chartTitle,
          units: decoratedState.units,
          setpoint: decoratedState.getDeviceSetpoint ? decoratedState.getDeviceSetpoint() : null,
          sampleRate: decoratedState.sampleRate,
        });
        decoratedSystemState.chartingState = decoratedState;
      };
    }

    function addChartMethods() {
      Object.keys(decoratedSystemState).forEach((state) => {
        if (decoratedSystemState[state] && decoratedSystemState[state].chartTitle) {
          addChartMethod(decoratedSystemState[state], systemState);
        }
      });
    }

    addChartMethods(decoratedSystemState);

    return decoratedSystemState;
  }

  return decorate;
}

module.exports = (container) => {
  container.decorator('systemState', getDecorator(container.container.eventEmitter));
};
