function analyzeStageComplete(reachedSetpoint) {
  let diversionValveIsDiverting = false;
  let cellAirReachedSetpoint = false;
  let cellPressureReachedSetpoint = false;
  let cellTemperatureReachedSetpoint = false;
  let diskRpmReachedSetpoint = false;
  let laserPowerReachedSetpoint = false;
  let fidComplete = false;

  function isComplete() {
    return (
      diversionValveIsDiverting
      && cellAirReachedSetpoint
      && cellPressureReachedSetpoint
      && cellTemperatureReachedSetpoint
      && diskRpmReachedSetpoint
      && laserPowerReachedSetpoint
      && fidComplete
    );
  }

  function onDiversionValve(args) { diversionValveIsDiverting = args; }

  function onCellAir(args, setpoints) {
    cellAirReachedSetpoint = reachedSetpoint(args, setpoints.cellAir);
  }

  function onCellPressure(args, setpoints) {
    cellPressureReachedSetpoint = reachedSetpoint(args, setpoints.cellPressure);
  }

  function onCellTemperature(args, setpoints) {
    cellTemperatureReachedSetpoint = reachedSetpoint(args, setpoints.cellTemperature);
  }

  function onDiskRpm(args, setpoints) {
    diskRpmReachedSetpoint = reachedSetpoint(args, setpoints.cellDiskSpeed);
  }

  function onLaser(args, setpoints) {
    laserPowerReachedSetpoint = reachedSetpoint(args, setpoints.laserOutput);
  }

  function onFidStarted() { fidComplete = false; }
  function onFidComplete() { fidComplete = true; }


  return {
    mode: 'analyze',
    stage: 5,
    last: true,
    listeners: [
      { event: 'diversionvalve', handler: onDiversionValve },
      { event: 'cellair', handler: onCellAir },
      { event: 'cellpressure', handler: onCellPressure },
      { event: 'celltemperature', handler: onCellTemperature },
      { event: 'diskrpm', handler: onDiskRpm },
      { event: 'laser', handler: onLaser },
      { event: 'fid.started', handler: onFidStarted },
      { event: 'fid.complete', handler: onFidComplete },
    ],
    isComplete,
  };
}

module.exports = (container) => {
  container.service('analyzeStageComplete', analyzeStageComplete, 'reachedSetpoint');
};
