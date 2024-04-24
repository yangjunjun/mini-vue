import { patchProp } from './patchProp.js'

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
    } = options

    const mount = (vnode, container, anchor = null) => {
        const el = vnode.el = createElement(vnode.type)
        // 处理 children
        if (Array.isArray(vnode.children)) {
            vnode.children.forEach(item => {
                mount(item, el, null)
            })
        } else {
            setElementText(el, vnode.children)
        }
        // 处理 props
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProp(el, key, null, vnode.props[key])
            }
        }
        insert(el, container, anchor)
    }

    const hasKey = (vnodes) => {
        return vnodes.some(item => item.key)
    }

    const patchProps = (el, oldProps, newProps) => {
        for(const key in oldProps) {
            if (!(key in newProps)) {
                patchProp(el, key, oldProps[key], null)
            }
        }
        for(const key in newProps) {
            patchProp(el, key, oldProps[key], newProps[key])
        }
    }
    /**
     * patch 
     * @param {*} n1 旧 vnode
     * @param {*} n2 新 vnode
     * @param {*} container 容器
     */
    const patch = function (n1, n2, container) {
        if (n1.type === n2.type) {
            const el = n2.el = n1.el
            const oldProps = n1.props || {}
            const newProps = n2.props || {}            
            if (Array.isArray(n1.children) && Array.isArray(n2.children)) {
                if (hasKey(n2.children)) {
                    patchKeysChildren(n1, n2, el)
                } else {
                    patchChildren(n1, n2, el)
                }
            } else if (Array.isArray(n1.children) && typeof n2.children === 'string') {
                n1.children.forEach(item => {
                    unmount(item)
                })
                setElementText(el, n2.children)
            } else if (typeof n1.children === 'string' && Array.isArray(n2.children)) {
                setElementText(el, '')
                n2.children.forEach(item => {
                    mount(item, el)
                })
            } else {
                setElementText(el, n2.children)
            }
            patchProps(el, oldProps, newProps)
        } else {
            const anchor = nextSibling(n1.el)
            unmount(n1)
            // todo 获取 anchor
            mount(n2, container, anchor)
        }
    }
    // 最简单实现，仅作为示例
    const patchChildrenOld = (n1, n2, container) => {
        n1.children.forEach(item => {
            unmount(item)
        });
        n2.children.forEach(item => {
            mount(item, container)
        });
    }
    // 针对 非 key children 的 diff
    const patchChildren = (n1, n2, container) => {
        const oldChildren = n1.children
        const newChildren = n2.children
        const commonLength = Math.min(oldChildren.length, newChildren.length)
        for (let i = 0; i < commonLength; i++) {
            patch(oldChildren[i], newChildren[i], container)
        }
        if (oldChildren.length > commonLength) {
            for (let i = commonLength; i < oldChildren.length; i++) {
                unmount(oldChildren[i])
            }
        }
        if (newChildren.length > commonLength) {
            for (let i = commonLength; i < newChildren.length; i++) {
                mount(newChildren[i], container)
            }
        }
    }
    // 针对 key children 的 simple diff
    const patchKeysChildren = (n1, n2, container) => {
        const oldChildren = n1.children
        const newChildren = n2.children
        let lastIndex = 0
        for (let i = 0; i < newChildren.length; i++) {
            const newVNode = newChildren[i]
            let j = 0
            for (j; j < oldChildren.length; j++) {
                const oldVNode = oldChildren[j]
                if (newVNode.key !== undefined && newVNode.key === oldVNode.key) {
                    patch(oldVNode, newVNode, container)
                    if (j < lastIndex) {
                        const prevVNode = newChildren[i - 1]
                        if (prevVNode) {
                            const anchor = nextSibling(prevVNode.el)
                            insert(newVNode.el, container, anchor)
                        }
                    } else {
                        lastIndex = j
                    }
                    break
                }
            }
            if (j === oldChildren.length) {
                //新增
                const prevVNode = newChildren[i - 1]
                let anchor = null
                if (prevVNode) {
                    anchor = nextSibling(prevVNode.el)
                } else {
                    anchor = container.firstChild
                }
                mount(newVNode, container, anchor)
            }
        }
        for (let i = 0; i < oldChildren.length; i++) {
            const oldVNode = oldChildren[i];
            const finder = newChildren.find(item => item.key !== undefined && item.key === oldVNode.key)
            if (!finder) {
                unmount(oldVNode)
            }
        }
    }

    const unmount = function (n1) {
        const el = n1.el
        if (el) {
            remove(el)
        }
    }

    function render(vnode, container) {
        if (vnode) {
            if (container._vnode) {
                patch(container._vnode, vnode, container);
            } else {
                mount(vnode, container)
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
    }
}
const renderer = createRender({
    createElement(tag) {
        return document.createElement(tag)
    },
    setElementText(el, text) {
        return el.textContent = text;
    },
    insert(child, parent, anthor = null) {
        parent.insertBefore(child, anthor)
    },
    remove: (child) => {
        const parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },
    nextSibling(node) {
        return node.nextSibling
    },
    parentNode(node) {
        return node.parentNode
    },
    createText(text) {
        return document.createTextNode(text);
    },
    createComment(text) {
        return document.createComment(text)
    },
    setText(el, text) {
        el.nodeValue = text;
    },
    patchProp,
})

export {
    renderer
}