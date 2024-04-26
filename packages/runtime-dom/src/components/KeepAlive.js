import { currentInstance } from '../intance.js'

const KeepAlive = {
  // KeepAlive 组件独有的属性，用作标识
  __isKeepAlive: true,
  setup(props, { slots }) {
    const cache = new Map()
    const instance = currentInstance
    const { move, createElement } = instance.keepAliveCtx

    const storageContainer = createElement('div')

    instance._deActivate = (vnode) => {
      move(vnode, storageContainer)
    }
    instance._activate = (vnode, container, anchor) => {
      move(vnode, container, anchor)
    }

    return () => {
      let rawVNode = slots.default()
      if (typeof rawVNode.type !== 'object') {
        return rawVNode
      }

      const cachedVNode = cache.get(rawVNode.type)
      if (cachedVNode) {
        rawVNode.instance = cachedVNode.instance
        rawVNode.keptAlive = true
      } else {
        cache.set(rawVNode.type, rawVNode)
      }
      rawVNode.shouldKeepAlive = true
      rawVNode.keepAliveInstance = instance
      return rawVNode
    }
  }
}

export {
    KeepAlive,
}