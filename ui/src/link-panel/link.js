function link(m, button) {
  function getComponent() {
    return {
      view: ({ attrs: { url, label, disabled } }) => m('a', { href: url, target: '_blank' }, m(button, { label, disabled })),
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
