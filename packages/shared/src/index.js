export const isObject = (value) => {
    return value !== null && typeof value === 'object'
}
export const isArray = (value) => {
    return Array.isArray(value)
}
export const isMap = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Map]'
}
export const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val, key) => hasOwnProperty.call(val, key);
