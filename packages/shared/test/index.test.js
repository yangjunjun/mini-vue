import { describe, test, expect } from 'vitest'

import {
    isObject,
    isArray,
    isMap,
    hasOwn,
} from '../src/index.js'

describe('isObject', () => {
    test('null is false', () => {
        expect(isObject(null)).toBe(false)
        expect(isObject('abc')).toBe(false)        
    })
    test('obj is false', () => {
        expect(isObject({})).toBe(true)
        expect(isObject(new Map())).toBe(true)        
    })     
}) 
