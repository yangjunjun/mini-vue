const resolveProps = (propsOption = {}, vnodeProps = {}) => {
  const props = {};
  const attrs = {};
  for (const key in vnodeProps) {
    if (key in propsOption) {
      props[key] = vnodeProps[key];
    } else {
      attrs[key] = vnodeProps[key];
    }
  }
  return [props, attrs];
};

const hasPropsChanged = (prevProps, nextProps) => {
  const prevKeys = Object.keys(prevProps || {});
  const nextKeys = Object.keys(nextProps || {});
  if (prevKeys.length !== nextKeys.length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (prevProps[key] !== nextProps[key]) {
      return true;
    }
  }
  return false;
};
export { resolveProps, hasPropsChanged };
