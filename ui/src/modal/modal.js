require('./modal.css');

function modal(m) {
  function component() {
    function getOuterClasses(options) {
      return `.z-2.max.fixed.top-0.left-0.bg-${options.color || 'black'}-50${options.hide ? '.dn' : ''}`; // TODO: hide should display null instead of display non children for proper init
    }

    function getChildren(children, id) {
      if (children.length) {
        return m('x-card.shadow-1.ma-5pa.w-fc', {
          id,
          onclick: (e) => {
            e.stopPropagation();
          },
        }, m('.pa2', children));
      }
      return null;
    }

    return {
      view: ({ attrs, children }) => m(
        getOuterClasses(attrs),
        {
          onclick: () => {
            if (attrs.onclickout) { attrs.onclickout(); }
          },
        },
        getChildren(children, attrs.id),
      ),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('modal', modal, 'm');
};
