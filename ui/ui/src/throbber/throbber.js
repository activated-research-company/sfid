function throbber(m) {
  function component() {
    return {
      view: () => m('x-throbber.ma-aa.w-20px.h-20px', { type: 'spin' }),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('throbber', throbber, 'm');
};
