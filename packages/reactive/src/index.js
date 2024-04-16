import {
    isObject,
    isArray,
    isMap,
    hasOwn,
} from '@mini-vue/shared'

let activeEffect = null
export const targetMap = new WeakMap()

export const effect = (fn) => {
    function effectFn() {
        const currentEffect = activeEffect
        activeEffect = effectFn
        fn()
        activeEffect = currentEffect
    }
    effectFn();
}
export const track = (target, type, key) => {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set()));
        }
        dep.add(activeEffect)
    }
}
export const trigger = (target, type, key, newValue, oldValue) => {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        return
    }
    const effects = depsMap.get(key) ?? []

    const effectsToRun = []
    effects.forEach(effect => {
        if (effect !== activeEffect) {
            effectsToRun.push(effect)
        }
    })
    if (type === 'add' || type === 'delete') {
        const effectsOwnKeys = depsMap.get(ITERATE_KEY) ?? []
        effectsOwnKeys.forEach(effect => {
            if (effect !== activeEffect) {
                effectsToRun.push(effect)
            }
        })
    }
    if (type === 'set' && isMap(target)) {
        const effectsOwnKeys = depsMap.get(ITERATE_KEY) ?? []
        effectsOwnKeys.forEach(effect => {
            if (effect !== activeEffect) {
                effectsToRun.push(effect)
            }
        })
    }
    if (type === 'clear') {
        [...depsMap.values()].forEach(deps => {
            deps.forEach(effect => {
                if (effect !== activeEffect) {
                    effectsToRun.push(effect)
                }
            })
        })
    }
    effectsToRun.forEach((effect) => {
        effect();
    })
}

const ITERATE_KEY = Symbol('iterate')


export const reactive = (obj) => {
    if (isMap(obj)) {
        return new Proxy(obj, {
            get(target, key, receiver) {
                if (key === 'get') {
                    return function mapGet(key) {
                        const ret = target.get(key)
                        track(target, 'get', key)
                        return isObject(ret) ? reactive(ret) : ret;
                    }
                } else if (key === 'has') {
                    return function mapGet(key) {
                        const ret = target.has(key)
                        track(target, 'has', key)
                        return ret;
                    }
                } else if (key === 'size') {
                    track(target, 'iterate', ITERATE_KEY)
                    return Reflect.get(target, key, target)
                } else if (key === 'forEach') {
                    return function mapForEach(...args) {
                        const ret = target.forEach(...args)
                        track(target, 'iterate', ITERATE_KEY)
                        return ret;
                    }
                } else if (key === Symbol.iterator) {
                    return function mapSet() {
                        track(target, 'iterate', ITERATE_KEY)
                        const ret = target[Symbol.iterator]()
                        return ret;
                    }
                } else if (key === 'keys') {
                    return function mapKeys() {
                        track(target, 'iterate', ITERATE_KEY)
                        const ret = target.keys()
                        return ret;
                    }
                } else if (key === 'set') {
                    return function mapForEach(key, value) {
                        const ret = target.set(key, value)
                        const type = target.has(key) ? 'set' : 'add'
                        trigger(target, type, key)
                        return ret;
                    }
                } else if (key === 'delete') {
                    return function mapDelete(key) {
                        const hasKey = target.has(key)
                        const ret = target.delete(key)
                        if (hasKey) {
                            trigger(target, 'delete', key)
                        }
                        return ret;
                    }
                } else if (key === 'clear') {
                    return function mapDelete() {
                        const ret = target.clear()
                        trigger(target, 'clear', key)
                        return ret;
                    }
                } else {
                    return Reflect.get(target, key, receiver).bind(target)
                }

            },
        })
    } else {
        return new Proxy(obj, {
            get(target, key, receiver) {
                track(target, 'get', key)
                if (isArray(obj) && key === 'shift') {
                    return (...args) => {
                        const ret = Array.prototype.shift.call(obj, ...args)
                        trigger(obj, 'length')
                        return ret;
                    }
                }
                const ret = Reflect.get(target, key, receiver)
                if (isObject(ret)) {
                    return reactive(ret)
                } else {
                    return ret
                }
            },
            set(target, key, newValue, receiver) {
                if (Array.isArray(target) && key >= target.length) {
                    const ret = Reflect.set(target, key, newValue, receiver)
                    trigger(target, 'iterate', 'length')
                    return ret
                } else {
                    let type = 'set'
                    if (!Object.prototype.hasOwnProperty.call(target, key)) {
                        type = 'add'
                    }
                    const ret = Reflect.set(target, key, newValue, receiver)
                    trigger(target, type, key)
                    return ret
                }
            },
            ownKeys(target) {
                track(target, 'iterate', ITERATE_KEY)
                return Reflect.ownKeys(target);
            },
            deleteProperty(target, key) {
                const hadKey = hasOwn(target, key);
                const oldValue = target[key];
                const result = Reflect.deleteProperty(target, key);
                if (result && hadKey) {
                    trigger(target, "delete", key, undefined, oldValue);
                }
                return result;
            }
        })
    }
}



export const ref = (val) => {
    const obj = {
        get value() {
            track(obj, 'get', 'value')
            return val
        },
        set value(value) {
            val = value
            trigger(obj, 'set', 'value')
        }
    }
    return obj
}