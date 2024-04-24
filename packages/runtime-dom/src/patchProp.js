import { hyphenate } from '@mini-vue/shared'

const patchClass = (el, value, isSVG = false) => {   
    if (value === null)  {
        el.removeAttribute('class')
    } else if (isSVG) {
        el.setAttribute("class", value);
    } else {
        el.className = value
    }
}
const setStyle = (style, key, value) => {
    style.setProperty(key, value)
}
const patchStyle = (el, prev, next) => {
    const style = el.style
    if (next) {
        if (prev) {
            for (const key in prev) {
                if (next[key] == null) {
                    setStyle(style, hyphenate(key), "");
                }
            }
        }
        for (const key in next) {
            setStyle(style, hyphenate(key), next[key]);
        }        
    } else {
        el.removeAttribute("style")
    }
}
const patchEvent = (el, rawName, prevValue, nextValue) => {
    const eventName = rawName.slice(2).toLowerCase()
    let eventMap = el.eventMap
    if (!eventMap) {
        el.eventMap = (eventMap = {})
    }
    let typeEventArray = eventMap[eventName]
    if (!typeEventArray) {
        eventMap[eventName] = (typeEventArray = [])
    }
    if (!prevValue && nextValue) {
        typeEventArray.push(nextValue)
    } else if (prevValue && nextValue) {
        if (prevValue !== nextValue) {
            const oldIndex = typeEventArray.indexOf(prevValue)
            if (oldIndex > -1) {
                typeEventArray.splice(oldIndex, 1)
            }
            typeEventArray.push(nextValue)
        }
    } else if (prevValue && !nextValue) {
        const oldIndex = typeEventArray.indexOf(prevValue)
        if (oldIndex > -1) {
            typeEventArray.splice(oldIndex, 1)
        }
    }
    const handler = (e) => {
        typeEventArray.forEach(event => {
            event.call(null, e)
        })
    }
    let hasEventMap = el.hasEventMap
    if (!hasEventMap) {
        el.hasEventMap = (hasEventMap = {})
    }
    if (!hasEventMap[eventName]) {
        el.addEventListener(eventName, handler)
        hasEventMap[eventName] = true
    }
}
const shouldSetAsProp = (el, key, value) => {
    return key in el;
}
const patchDOMProp = (el, key, value) => {
    if (value === null) {
        el[key] = ''
    } else {
        el[key] = value
    }
}
const patchAttr = (el, key, value, isSVG) => {
    if (value === null) {
        el.removeAttribute(key)
    } else {
        el.setAttribute(key, value)
    }  
}

/**
 * patch 元素属性
 * @param {*} el 元素
 * @param {*} key key
 * @param {*} oldValue 旧值
 * @param {*} newValue 新值
 */
export const patchProp = (el, key, prevValue, nextValue) => {
    if (key === 'class') {
        patchClass(el, nextValue)
    } else if (key === 'style') {
        patchStyle(el, prevValue, nextValue)
    } else if (key.startsWith('on')) {
        patchEvent(el, key, prevValue, nextValue)
    } else if (shouldSetAsProp(el, key, nextValue)) {
        patchDOMProp(el, key, nextValue)
    } else {
        patchAttr(el, key, nextValue, isSVG)
    }
}