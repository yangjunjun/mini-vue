const isObject = (value) => {
    return value !== null && typeof value === 'object'
}
const isArray = (value) => {
    return Array.isArray(value)
}
const isMap = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Map]'
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);

const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}

const hyphenateRE = /\B([A-Z])/g;
/**
 * backgroundColor -> background-color
 */
const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
)

export {
    isMap,
    isObject,
    isArray,
    hasOwn,
    hyphenate,
}