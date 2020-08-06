function analyzeStageOne(eventEmitter, reachedSetpoint) {
  let cellAirReachedSetpoint = false;
  const initialCellPressure = 1;
  let cellPressureReachedSetpoint = false;
  let diversionValveIsDiverting = false;
  let fidIgnited = false;
  let cellTemperatureReachedSetpoint = false;
  let diskRpmReachedSetpoint = false;

  function start(setpoints) {
    eventEmitter
      .emit('fid.start', setpoints)
      .emit('setdiskrpm', setpoints.cellDiskSpeed)
      .emit('setcellair', setpoints.cellAir)
      .emit('setcelltemperature', setpoints.cellTemperature)
      .emit('setcellpressure', initialCellPressure)
      .emit('setdiversionvalve', '0');
  }

  function onCellAir(args, setpoints) {
    cellAirReachedSetpoint = reachedSetpoint(args, setpoints.cellAir);
  }

  function onCellPressure(args) {
    cellPressureReachedSetpoint = reachedSetpoint(args, initialCellPressure);
  }

  function onDiversionValve(args) { diversionValveIsDiverting = args; }
  function onFidIgnited(args) { fidIgnited = args; }

  function onCellTemperature(args, setpoints) {
    cellTemperatureReachedSetpoint = reachedSetpoint(args, setpoints.cellTemperature);
  }

  function onDiskRpm(args, setpoints) {
    diskRpmReachedSetpoint = reachedSetpoint(args, setpoints.cellDiskSpeed);
  }

  return {
    mode: 'analyze',
    stages: 5,
    stage: 1,
    first: true,
    listeners: [
      { event: 'cellair', handler: onCellAir },
      { event: 'cellpressure', handler: onCellPressure },
      { event: 'diversionvalve', handler: onDiversionValve },
      { event: 'fidignited', handler: onFidIgnited },
      { event: 'celltemperature', handler: onCellTemperature },
      { event: 'diskrpm', handler: onDiskRpm },
    ],
    start,
    steps: [
      {
        description: 'Bypassing liquid flow',
        isComplete: () => diversionValveIsDiverting,
      },
      {
        description: 'Pressurizing the cell to 1 PSIG',
        isComplete: () => cellPressureReachedSetpoint,
      },
      {
        description: 'Flowing air to the cell',
        isComplete: () => cellAirReachedSetpoint,
      },
      {
        description: 'Ramping the disc',
        isComplete: () => diskRpmReachedSetpoint,
      },
      {
        description: 'Heating the cell',
        isComplete: () => cellTemperatureReachedSetpoint,
      },
      {
        description: '',
        isComplete: () => fidIgnited,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('analyzeStageOne', analyzeStageOne, 'eventEmitter', 'reachedSetpoint');
};
