function page(m, nav) {
  function component() {
    return {
      view: ({ children }) => [
        m('.pb3', m(nav)),
        children,
      ],
    };
  }

  return component;
}

module.exports = page;
