function link(m, button) {
  function getComponent() {
    return {
      view: ({ attrs: { url, label } }) => m('a', { href: url, target: '_blank' }, m(button, { label })),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'link',
    link,
    'm',
    'button',
  );
};
