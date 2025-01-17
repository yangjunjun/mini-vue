import { isObject, capitalise } from "@mini-vue/shared";
import { reactive, effect } from "@mini-vue/reactive";
import { patchProp } from "./patchProp.js";
import { h } from "./h.js";
import { resolveProps, hasPropsChanged } from "./resolveProps.js";
import { setCurrentInstance } from "./intance.js";

const Text = Symbol("Text");
const Fragment = Symbol("Fragment");

const createRender = (options = {}) => {
  const {
    createElement,
    setElementText,
    insert,
    remove,
    nextSibling,
    parentNode,
    createText,
    createComment,
    setText,
    patchProp,
  } = options;

  const mountElement = (vnode, container, anchor) => {
    const el = (vnode.el = createElement(vnode.type));
    // // 如果是组件产生的 subtree
    // if (vnode.vnode) {
    //     vnode.vnode.el = el
    // }
    // 处理 children
    if (Array.isArray(vnode.children)) {
      vnode.children.forEach((item) => {
        mount(item, el, null);
      });
    } else {
      setElementText(el, vnode.children);
    }
    // 处理 props
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProp(el, key, null, vnode.props[key]);
      }
    }
    const needTransition = vnode.transition;
    if (needTransition) {
      vnode.transition.beforeEnter(el);
    }
    insert(el, container, anchor);
    if (needTransition) {
      vnode.transition.enter(el);
    }
  };
  const mountText = (vnode, container, anchor) => {
    const el = (vnode.el = createText(vnode.children));
    insert(el, container, anchor);
  };
  const mountFragment = (vnode, container, anchor) => {
    vnode.el = container;
    vnode.children.forEach((item) => {
      mount(item, container, null);
    });
  };
  const mountComponent = (vnode, container, anchor) => {
    const componentOptions = vnode.type;
    let {
      data,
      render,
      methods,
      beforeCreate,
      created,
      beforeMounted,
      mounted,
      beforeUpdated,
      updated,
      props: propsOption,
      setup,
    } = componentOptions;

    beforeCreate && beforeCreate();

    const state = reactive(data ? data() : {});
    const [props, attrs] = resolveProps(propsOption, vnode.props);

    const emit = (key, ...args) => {
      const eventKey = `on${capitalise(key)}`;
      if (attrs[eventKey] && typeof attrs[eventKey] === "function") {
        attrs[eventKey](...args);
      }
    };
    let slots = {};
    if (Array.isArray(vnode.children)) {
      slots.default = () => {
        return vnode.children;
      };
    } else {
      slots = vnode.children;
    }
    const instance = {
      state,
      props: reactive(props),
      attrs,
      inMounted: false,
      subtree: null,
      methods,
      emit,
      slots,
      beforeMount: [],
      mounted: [],
      beforeUpdate: [],
      updated: [],
      beforeUnmount: [],
      unmounted: [],
      // 只有 KeepAlive 组件的实例下会有 keepAliveCtx 属性
      keepAliveCtx: null,
    };
    // 检查当前要挂载的组件是否是 KeepAlive 组件
    const isKeepAlive = vnode.type.__isKeepAlive;
    if (isKeepAlive) {
      // 在 KeepAlive 组件实例上添加 keepAliveCtx 对象
      instance.keepAliveCtx = {
        // move 函数用来移动一段 vnode
        move(vnode, container, anchor) {
          // 本质上是将组件渲染的内容移动到指定容器中，即隐藏容器中
          insert(vnode.instance.subtree.el, container, anchor);
        },
        createElement,
      };
    }
    if (mounted) {
      instance.mounted.push(mounted);
    }
    let setupState = null;
    if (setup) {
      setCurrentInstance(instance);
      const setupContext = {
        attrs,
        emit,
        slots,
      };
      const setupResult = setup(instance.props, setupContext);
      if (typeof setupResult === "function") {
        if (render) {
          console.error("setup 返回渲染函数，render 选项将被忽略！");
        }
        render = setupResult;
      } else {
        setupState = setupResult;
      }
      setCurrentInstance(null);
    }

    vnode.instance = instance;
    const renderContext = new Proxy(instance, {
      get(target, key, receiver) {
        if (key in target.state) {
          return target.state[key];
        } else if (key in target.props) {
          return target.props[key];
        } else if (key in target.attrs) {
          return target.attrs[key];
        } else if (setupState && key in setupState) {
          return setupState[key];
        } else if (target.methods && key in target.methods) {
          return target.methods[key];
        } else if (key === "$slot") {
          return target.slots;
        } else {
          return target[key];
        }
      },
      set(target, key, newValue, receiver) {
        if (key in target.state) {
          target.state[key] = newValue;
          return true;
        } else if (setupState && key in setupState) {
          setupState[key] = newValue;
          return true;
        } else {
          console.warn(`min-vue, set in target[${key}] is not allowed`);
        }
      },
    });

    created && created.call(renderContext);
    effect(() => {
      // console.log('vnode', vnode)
      const subtree = render.call(renderContext, renderContext);
      if (!instance.inMounted) {
        instance.beforeMount.forEach((fn) => fn.call(renderContext));

        mount(subtree, container, anchor);
        instance.inMounted = true;
        instance.mounted.forEach((fn) => fn.call(renderContext));
      } else {
        instance.beforeUpdate.forEach((fn) => fn.call(renderContext));
        patch(instance.subtree, subtree, container, instance);
        instance.updated.forEach((fn) => fn.call(renderContext));
      }
      instance.subtree = subtree;
    });
  };
  const mount = (vnode, container, anchor = null) => {
    if (vnode) {
      if (typeof vnode.type === "string") {
        mountElement(vnode, container, anchor);
      } else if (vnode.type === Text) {
        mountText(vnode, container, anchor);
      } else if (vnode.type === Fragment) {
        mountFragment(vnode, container, anchor);
      } else if (isObject(vnode.type)) {
        if (vnode.keptAlive) {
          vnode.keepAliveInstance._activate(vnode, container, anchor);
        } else if (vnode.type.__isTeleport) {
          vnode.el = container;
          vnode.type.process(null, vnode, container, anchor, {
            mount,
            patchChildren,
            unmount,
            move(vnode, container, anchor) {
              insert(getVnodeEl(vnode), container, anchor);
            },
          });
        } else {
          mountComponent(vnode, container, anchor);
        }
      } else {
        throw new Error("Not known vnode.type", vnode.type);
      }
    }
  };

  const hasKey = (vnodes) => {
    return vnodes.some((item) => item && item.key);
  };

  const patchProps = (el, oldProps, newProps) => {
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProp(el, key, oldProps[key], null);
      }
    }
    for (const key in newProps) {
      patchProp(el, key, oldProps[key], newProps[key]);
    }
  };
  const patchElement = (n1, n2, container) => {
    const el = (n2.el = n1.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    if (Array.isArray(n1.children) && Array.isArray(n2.children)) {
      if (hasKey(n2.children)) {
        patchKeysChildren(n1, n2, el);
      } else {
        patchChildren(n1, n2, el);
      }
    } else if (Array.isArray(n1.children) && typeof n2.children === "string") {
      n1.children.forEach((item) => {
        unmount(item);
      });
      setElementText(el, n2.children);
    } else if (typeof n1.children === "string" && Array.isArray(n2.children)) {
      setElementText(el, "");
      n2.children.forEach((item) => {
        mount(item, el);
      });
    } else {
      setElementText(el, n2.children);
    }
    patchProps(el, oldProps, newProps);
  };
  const patchText = (n1, n2, container) => {
    const el = (n2.el = n1.el);
    if (n1.children !== n2.children) {
      setText(el, n2.children);
    }
  };
  const patchFragment = (n1, n2, container) => {
    if (hasKey(n2.children)) {
      patchKeysChildren(n1, n2, container);
    } else {
      patchChildren(n1, n2, container);
    }
  };
  const patchComponent = (n1, n2, container) => {
    const instance = (n2.instance = n1.instance);
    const { props } = instance;
    if (hasPropsChanged(n1.props, n2.props)) {
      const [nextProps] = resolveProps(n2.type.props, n2.props);
      for (const key in nextProps) {
        props[key] = nextProps[key];
      }
      for (const k in props) {
        if (!(k in nextProps)) {
          delete props[key];
        }
      }
    }
  };
  // 获取 vnode 对应的 el
  const getVnodeEl = (vnode) => {
    if (!vnode) {
      return null;
    } else if (vnode.el) {
      return vnode.el;
    } else if (isObject(vnode.type)) {
      return getVnodeEl(vnode.instance.subtree);
    }
  };
  /**
   * patch
   * @param {*} n1 旧 vnode
   * @param {*} n2 新 vnode
   * @param {*} container 容器
   */
  const patch = function (n1, n2, container) {
    if (n1 && n2 && n1.type === n2.type) {
      if (typeof n2.type === "string") {
        patchElement(n1, n2, container);
      } else if (n2.type === Text) {
        patchText(n1, n2, container);
      } else if (n2.type === Fragment) {
        patchFragment(n1, n2, container);
      } else if (isObject(n2.type)) {
        if (n2.type.__isTeleport) {
          n2.type.process(n1, n2, container, null, {
            mount,
            patchChildren,
            unmount,
            move(vnode, container, anchor) {
              insert(getVnodeEl(vnode), container, anchor);
            },
          });
        } else {
          patchComponent(n1, n2, container);
        }
      } else {
        throw new Error("Not known vnode.type", vnode.type);
      }
    } else {
      const el = getVnodeEl(n1);
      const anchor = (el && nextSibling(el)) || null;
      unmount(n1);
      // todo 获取 anchor
      mount(n2, container, anchor);
    }
  };
  // 最简单实现，仅作为示例
  const patchChildrenOld = (n1, n2, container) => {
    n1.children.forEach((item) => {
      unmount(item);
    });
    n2.children.forEach((item) => {
      mount(item, container);
    });
  };
  // 针对 非 key children 的 diff
  const patchChildren = (n1, n2, container) => {
    const oldChildren = n1.children;
    const newChildren = n2.children;
    const commonLength = Math.min(oldChildren.length, newChildren.length);
    for (let i = 0; i < commonLength; i++) {
      patch(oldChildren[i], newChildren[i], container);
    }
    if (oldChildren.length > commonLength) {
      for (let i = commonLength; i < oldChildren.length; i++) {
        unmount(oldChildren[i]);
      }
    }
    if (newChildren.length > commonLength) {
      for (let i = commonLength; i < newChildren.length; i++) {
        mount(newChildren[i], container);
      }
    }
  };
  // 针对 key children 的 simple diff
  const patchKeysChildren = (n1, n2, container) => {
    const oldChildren = n1.children;
    const newChildren = n2.children;
    let lastIndex = 0;
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i];
      let j = 0;
      for (j; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j];
        if (newVNode.key !== undefined && newVNode.key === oldVNode.key) {
          patch(oldVNode, newVNode, container);
          if (j < lastIndex) {
            const prevVNode = newChildren[i - 1];
            if (prevVNode) {
              const anchor = nextSibling(prevVNode.el);
              insert(newVNode.el, container, anchor);
            }
          } else {
            lastIndex = j;
          }
          break;
        }
      }
      if (j === oldChildren.length) {
        //新增
        const prevVNode = newChildren[i - 1];
        let anchor = null;
        if (prevVNode) {
          anchor = nextSibling(prevVNode.el);
        } else {
          anchor = container.firstChild;
        }
        mount(newVNode, container, anchor);
      }
    }
    for (let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const finder = newChildren.find(
        (item) => item.key !== undefined && item.key === oldVNode.key,
      );
      if (!finder) {
        unmount(oldVNode);
      }
    }
  };
  const unmountComponent = (vnode) => {
    const instance = vnode.instance;
    instance.beforeUnmount.forEach((fn) => fn());
    unmount(instance.subtree);
    instance.unmounted.forEach((fn) => fn());
  };
  const unmount = function (vnode) {
    if (vnode) {
      if (vnode.type === Fragment) {
        vnode.children.forEach((c) => unmount(c));
      } else if (isObject(vnode.type)) {
        if (vnode.shouldKeepAlive) {
          vnode.keepAliveInstance._deActivate(vnode);
        } else if (vnode.type.__isTeleport) {
          vnode.children.forEach((c) => unmount(c));
        } else {
          unmountComponent(vnode);
        }
      } else {
        const needTransition = vnode.transition;
        const parent = vnode.el.parentNode;
        if (parent) {
          const performRemove = () => parent.removeChild(vnode.el);
          if (needTransition) {
            vnode.transition.leave(vnode.el, performRemove);
          } else {
            performRemove();
          }
        }
      }
    }
  };

  function render(vnode, container) {
    if (vnode) {
      if (container._vnode) {
        patch(container._vnode, vnode, container);
      } else {
        mount(vnode, container);
      }
    } else {
      if (container._vnode) {
        unmount(container._vnode);
      }
    }
    container._vnode = vnode;
  }
  return {
    render,
  };
};
const renderer = createRender({
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    return (el.textContent = text);
  },
  insert(child, parent, anthor = null) {
    parent.insertBefore(child, anthor);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  nextSibling(node) {
    return node.nextSibling;
  },
  parentNode(node) {
    return node.parentNode;
  },
  createText(text) {
    return document.createTextNode(text);
  },
  createComment(text) {
    return document.createComment(text);
  },
  setText(el, text) {
    el.nodeValue = text;
  },
  patchProp,
});

export { renderer, Text, Fragment, h };
