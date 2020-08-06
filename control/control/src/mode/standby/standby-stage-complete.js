function standbyStageComplete(reachedSetpoint) {
  const standbyCellAir = 20;
  let cellAirReachedSetpoint = false;
  const standbyCellPressure = 1;
  let cellPressureReachedSetpoint = false;
  let cellTemperatureReachedSetpoint = false;
  let diversionValveIsDiverting = false;
  let diskRpm = 0;
  let laserPower = 0;
  let fidComplete = false;

  function isComplete() {
    return (
      cellAirReachedSetpoint
      && cellPressureReachedSetpoint
      && cellTemperatureReachedSetpoint
      && diversionValveIsDiverting
      && laserPower === 0
      && diskRpm === 0
      && fidComplete
    );
  }

  function onDiversionValve(args) { diversionValveIsDiverting = args; }

  function onCellAir(args) { cellAirReachedSetpoint = reachedSetpoint(args, standbyCellAir); }
  function onCellPressure(args) { cellPressureReachedSetpoint = reachedSetpoint(args, standbyCellPressure); }
  function onCellTemperature(args, setpoints) { cellTemperatureReachedSetpoint = reachedSetpoint(args, setpoints.cellTemperature); }
  function onDiskRpm(args) { diskRpm = args.actual; }
  function onLaserPower(args) { laserPower = args.actual; }
  function onFidStarted() { fidComplete = false; }
  function onFidComplete() { fidComplete = true; }

  return {
    mode: 'standby',
    stage: 5,
    last: true,
    listeners: [
      { event: 'diversionvalve', handler: onDiversionValve },
      { event: 'cellair', handler: onCellAir },
      { event: 'cellpressure', handler: onCellPressure },
      { event: 'celltemperature', handler: onCellTemperature },
      { event: 'diskrpm', handler: onDiskRpm },
      { event: 'laserpower', handler: onLaserPower },
      { event: 'fid.started', handler: onFidStarted },
      { event: 'fid.complete', handler: onFidComplete },
    ],
    isComplete,
  };
}

module.exports = (container) => {
  container.service('standbyStageComplete', standbyStageComplete, 'reachedSetpoint');
};
