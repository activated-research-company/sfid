function button(m) {
  function component() {
    function getButtonClasses(large, huge, disabled, toggled) {
      return `ma-aa.w-100${large ? '.button-large' : ''}${huge ? '.button-huge' : ''}${disabled ? '[disabled]' : ''}${toggled ? '[toggled]' : ''}`;
    }

    return {
      view: ({ attrs, children }) => m(
        // TODO: figure out betting sizing than just passing in large/huge as separate attributes
        `x-button.ma-aa.w-100${getButtonClasses(attrs.large, attrs.huge, attrs.disabled, attrs.toggled)}`,
        {
          onclick: attrs.onclick,
          skin: 'textured-condensed',
        },
        m('x-box', [
          attrs.icon ? m(`x-icon.${attrs.color}`, { name: attrs.icon }) : null,
          attrs.label ? m(`x-label.${attrs.color}`, attrs.label) : null,
          children,
        ]),
      ),
    };
  }
  return component();
}

module.exports = (container) => {
  container.service('button', button, 'm');
};
