function fidStageThree(eventEmitter) {
  let ignited = false;

  function start() { if (!ignited) { eventEmitter.emit('setfidigniter'); } }

  function onFid(args) { ignited = args.ignited; }

  return {
    mode: 'analyze',
    stage: 3,
    listeners: [
      { event: 'fid', handler: onFid },
    ],
    start,
    steps: [
      {
        description: 'Igniting the flame',
        applies: () => !ignited,
        isComplete: () => ignited,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('fidStageThree', fidStageThree, 'eventEmitter');
};
