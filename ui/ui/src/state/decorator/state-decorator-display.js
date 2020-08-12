function decorate(systemState) {
  const decoratedSystemState = systemState;

  const raw = (value) => value;
  const oneDecimal = (value) => value.toFixed(1);
  const twoDecimals = (value) => value.toFixed(2);
  const addNumberSign = (number) => `${parseFloat(number) >= 0 ? '+' : ''}${number}`;
  const sixCharacters = (value) => {
    let transformedValue = value.toString().substring(0, 6);
    if (transformedValue.substring(transformedValue.length - 1) === '.') {
      transformedValue = transformedValue.substring(0, transformedValue.length - 1);
    }
    return transformedValue;
  };

  function pipe(...transforms) {
    function getDisplayValue() {
      if (this.actual == null) { return 'NaN'; }
      return transforms.reduce((prev, transform) => transform(prev), this.actual);
    }
    return getDisplayValue;
  }

  decoratedSystemState.fidAir.getDisplayValue = pipe(oneDecimal, addNumberSign, sixCharacters);
  decoratedSystemState.fidAirPressure.getDisplayValue = pipe(oneDecimal, addNumberSign, sixCharacters);
  decoratedSystemState.fidHydrogen.getDisplayValue = pipe(oneDecimal, addNumberSign, sixCharacters);
  decoratedSystemState.fidHydrogenPressure.getDisplayValue = pipe(oneDecimal, addNumberSign, sixCharacters);
  decoratedSystemState.fidTemperature.getDisplayValue = pipe(twoDecimals);
  decoratedSystemState.fid.getDisplayValue = pipe(twoDecimals, sixCharacters);
  decoratedSystemState.fidFlameTemperature.getDisplayValue = pipe(twoDecimals);

  function getUptimeDisplayValue() {
    let secondsRemaining = this.actual;
    const days = Math.floor(secondsRemaining / (24 * 60 * 60));
    secondsRemaining -= days * 24 * 60 * 60;
    const hours = Math.floor(secondsRemaining / (60 * 60));
    secondsRemaining -= hours * 60 * 60;
    const minutes = Math.floor(secondsRemaining / 60);
    secondsRemaining -= minutes * 60;
    return `${days}d ${hours}h ${minutes}m`;
  }

  decoratedSystemState.computerUptime.getDisplayValue = getUptimeDisplayValue;

  decoratedSystemState.computerTemperature.getDisplayValue = pipe(twoDecimals);
  decoratedSystemState.computerCpu.getDisplayValue = pipe(Math.round);
  decoratedSystemState.computerMemory.getDisplayValue = pipe(Math.round);
  decoratedSystemState.computerFsSize.getDisplayValue = pipe(twoDecimals);
  decoratedSystemState.computerFsUsed.getDisplayValue = pipe(twoDecimals);
  decoratedSystemState.computerIp.getDisplayValue = pipe(raw);

  return decoratedSystemState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
