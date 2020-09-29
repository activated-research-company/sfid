function fidStageThree(eventEmitter) {
  let ignited = false;

  function start() { if (!ignited) { eventEmitter.emit('setfidigniter'); } }

  function onIgnited(args) { ignited = args; }

  return {
    mode: 'analyze',
    stage: 3,
    listeners: [
      { event: 'fidignited', handler: onIgnited },
    ],
    start,
    steps: [
      {
        description: 'Lighting the FID flame',
        applies: () => !ignited,
        isComplete: () => ignited,
      },
    ],
  };
}

module.exports = (container) => {
  container.service('fidStageThree', fidStageThree, 'eventEmitter');
};
