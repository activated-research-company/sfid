const o = require('ospec');
const getNewLayout = require('../layout');

o.spec('layout', () => {
  let mithrilMock;
  let envMock;
  let navMock;
  let errorMessageMock;
  let modalMock;
  let attrsMock;
  let childrenMock;
  let vnodeMock;
  let layout;

  o.beforeEach(() => {
    mithrilMock = o.spy((element) => {
      if (element === fadeInMock) { return 'fadeIn'; }
      if (element === '.relative.max.bg-light-gray.cursor-none') { return 'layout'; }
      if (element === '.relative.max.bg-light-gray') { return 'layoutDev'; }
      return null;
    });
    envMock = {
      dev: false,
    };
    navMock = {};
    errorMessageMock = {};
    modalMock = {};
    attrsMock = {};
    childrenMock = {};
    vnodeMock = {
      children: childrenMock,
      attrs: attrsMock,
    };

    layout = getNewLayout(mithrilMock, envMock, navMock, errorMessageMock, modalMock);
  });
});
