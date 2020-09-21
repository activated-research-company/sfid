function key(m) { // TODO: this should really just be a button with options
  return {
    view: ({ attrs }) => m(
      `x-button.padded-button.mr${attrs.margin}${attrs.toggled ? '[toggled]' : ''}`,
      {
        skin: 'textured',
        id: attrs.id,
        onclick: attrs.onClick,
        disabled: attrs.disabled,
      },
      attrs.icon ? m(`x-icon.icon-${attrs.icon.size}`, { name: attrs.icon.name }) : m('x-label', attrs.value),
    ),
  };
}

module.exports = (container) => {
  container.service('key', key, 'm');
};
