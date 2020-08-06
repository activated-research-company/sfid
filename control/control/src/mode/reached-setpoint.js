const reachedSetpoint = (args, setpoint) => (args.setpoint === setpoint) && args.reachedSetpoint;

module.exports = (container) => {
  container.constant('reachedSetpoint', reachedSetpoint);
};
