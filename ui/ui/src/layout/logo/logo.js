function logo(m) {
  function getComponent() {
    return {
      view: () => m('img', { src: './assets/ARC_Teardrop_Transparent.png' }),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service('logo', logo, 'm');
};
