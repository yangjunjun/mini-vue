const Teleport = {
  __isTeleport: true,
  props: {
    to: {
      type: [String, Object],
    },
  },
  process(n1, n2, container, anchor, internals) {
    const { mount, patchChildren, unmount, move } = internals;
    if (!n1) {
      const target =
        typeof n2.props.to === "string"
          ? document.querySelector(n2.props.to)
          : n2.props.to;
      n2.children.forEach((c) => {
        mount(c, target, anchor);
      });
    } else {
      patchChildren(n1, n2, container);
      if (n1.props.to !== n2.props.to) {
        const newTarget =
          typeof n2.props.to === "string"
            ? document.querySelector(n2.props.to)
            : n2.props.to;
        n2.children.forEach((c) => {
          move(c, newTarget);
        });
      }
    }
  },
};

export { Teleport };
