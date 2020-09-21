const src = require('../../assets/ARC_Teardrop_Transparent.png');

function logo(m) {
  function getComponent() {
    return {
      view: () => m('img', { src: src.default }),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service('logo', logo, 'm');
};
