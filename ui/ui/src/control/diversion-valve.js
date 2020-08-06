function getDiversionValve(m, { diversionValve }, stateSwitch) {
  const CONFIRM_MESSAGE = 'Are you sure you want flow liquid to the cell without the laser running?';

  return {
    view: ({ attrs: { hideLabel } }) => m(stateSwitch, { state: diversionValve, hideLabel, confirmMessage: CONFIRM_MESSAGE }),
  };
}

module.exports = (container) => {
  container.service(
    'diversionValve',
    getDiversionValve,
    'm',
    'systemState',
    'stateSwitch',
  );
};
