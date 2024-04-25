import { isObject, capitalise } from '@mini-vue/shared'
import { reactive, effect } from '@mini-vue/reactive'
import { patchProp } from './patchProp.js'
import { h } from './h.js'
import { resolveProps, hasPropsChanged } from './resolveProps.js'

const Text = Symbol('Text')
const Fragment = Symbol('Fragment')

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

    const mountElement = (vnode, container, anchor) => {
        const el = vnode.el = createElement(vnode.type)
        // 如果是组件产生的 subtree
        if (vnode.vnode) {
            vnode.vnode.el = el
        }
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
    const mountText = (vnode, container, anchor) => {
        const el = vnode.el = createText(vnode.children)
        insert(el, container, anchor)
    }    
    const mountFragment = (vnode, container, anchor) => {
        vnode.el = container
        vnode.children.forEach(item => {
            mount(item, container, null)
        })
    }    
    const mountComponent = (vnode, container, anchor) => {
        const componentOptions = vnode.type
        let { 
            data, render, methods, beforeCreated, created, 
            beforeMounted, mounted, beforeUpdated, updated, 
            props: propsOption, setup,
        } = componentOptions
        
        beforeCreated && beforeCreated()

        const state = reactive(data ? data() : {})
        const [props, attrs] = resolveProps(propsOption, vnode.props)
        
        const emit = (key, ...args) => {
            const eventKey = `on${capitalise(key)}`
            if (attrs[eventKey] && typeof attrs[eventKey] === 'function'){
                attrs[eventKey](...args)
            }
        }
        let slots = {}
        if (vnode.children) {
            slots = vnode.children
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
        }
        let setupState = null
        if (setup) {
            const setupContext = {
                attrs,
                emit,
                slots,
            }
            const setupResult = setup(instance.props, setupContext)       
            if (typeof setupResult === 'function') {
                if (render) {
                    console.error('setup 返回渲染函数，render 选项将被忽略！')
                }
                render = setupResult
            } else {
                setupState = setupResult
            }
        }

        vnode.instance = instance
        const renderContext = new Proxy(instance, {
            get (target, key, receiver) {
                if (key in target.state) {
                    return target.state[key]
                } else if (key in target.props) {
                    return target.props[key]
                } else if (key in target.attrs) {
                    return target.attrs[key]
                } else if (setupState && key in setupState) {
                    return setupState[key]
                } else if (target.methods && key in target.methods) {
                    return target.methods[key]
                } else if (key === '$slot') {
                    return target.slots
                } else {
                    return target[key]
                }
            },
            set (target, key, newValue, receiver) {
                if (key in target.state) {
                    target.state[key] = newValue
                    return true
                } else if (setupState && key in setupState) {
                    setupState[key] = newValue
                    return true
                } else {
                    console.warn(`min-vue, set in target[${key}] is not allowed`)
                }
            }
        })
        
        created && created.call(renderContext)
        effect(() => {
            const subtree = render.call(renderContext, renderContext)
            if (subtree) {
                subtree.vnode = vnode
            }                
            if (!instance.subtree) {
                beforeMounted && beforeMounted.call(renderContext)
                mount(subtree, container, anchor)   
                instance.inMounted = true
                mounted && mounted.call(renderContext)
            } else {
                beforeUpdated && beforeUpdated.call(renderContext)
                patch(instance.subtree, subtree, container)
                updated && updated.call(renderContext)
            }
            vnode.subtree = subtree
            instance.subtree = subtree
        })
    }
    const mount = (vnode, container, anchor = null, instance = null) => {
        if (vnode) {
            if (typeof vnode.type === 'string') {
                mountElement(vnode, container, anchor, instance)
            } else if (vnode.type === Text) {
                mountText(vnode, container, anchor)
            } else if (vnode.type === Fragment) {
                mountFragment(vnode, container, anchor)
            } else if (isObject(vnode.type)) {
                mountComponent(vnode, container, anchor)
            } else {
                throw new Error('Not known vnode.type', vnode.type)
            }            
        }
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
    const patchElement = (n1, n2, container) => {
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
    }
    const patchText = (n1, n2, container) => {
        const el = n2.el = n1.el
        if (n1.children !== n2.children) {
            setText(el, n2.children)
        }
    }
    const patchFragment = (n1, n2, container) => {
        if (hasKey(n2.children)) {
            patchKeysChildren(n1, n2, container)
        } else {
            patchChildren(n1, n2, container)
        }
    }
    const patchComponent = (n1, n2, container) => {
        const instance = n2.instance = n1.instance
        const { props } = instance
        if (hasPropsChanged(n1.props, n2.props)) {
            const [ nextProps ] = resolveProps(n2.type.props, n2.props)
            for(const key in nextProps) {
                props[key] = nextProps[key]
            }
            for(const k in props) {
                if (!(k in nextProps)) {
                    delete props[key]
                }
            }
        }
    }   
    /**
     * patch 
     * @param {*} n1 旧 vnode
     * @param {*} n2 新 vnode
     * @param {*} container 容器
     */
    const patch = function (n1, n2, container) {
        if (n2 && n1.type === n2.type) {
            if (typeof n2.type === 'string') {
                patchElement(n1, n2, container)
            } else if (n2.type === Text) {
                patchText(n1, n2, container)
            } else if (n2.type === Fragment) {
                patchFragment(n1, n2, container)
            } else if (isObject(n2.type)) {
                patchComponent(n1, n2, container)
            } else {
                throw new Error('Not known vnode.type', vnode.type)
            }
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
    renderer,
    Text,
    Fragment,
    h,
    reactive,
}