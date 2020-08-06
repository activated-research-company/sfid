function addFadeOut() {
  return (dom) => {
    dom.classList.add('fade-out');
    dom.classList.add('absolute');
    dom.classList.add('z-999');
    return new Promise((resolve) => {
      dom.addEventListener('animationend', resolve);
    });
  };
}

module.exports = (container) => {
  container.service('addFadeOut', addFadeOut);
};