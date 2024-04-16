import { expect, test, vi } from 'vitest'

import { reactive, effect } from '../src/index.js'

test('array: basic get/set', () => {
    const fn = vi.fn()
    const state = reactive(['a', 'b', 'c'])
    
    effect(() => {
        fn(state[0])
    })
    // init
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('a')
    // state change
    state[0] = 'a1'
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledWith('a1')
})

test('array: whole get/set', () => {
    const fn = vi.fn()
    const state = reactive({
        data: ['a', 'b', 'c']
    })
    
    effect(() => {
        fn(state.data)
    })
    // init
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(['a', 'b', 'c'])
    // state change
    state.data = ['a1', 'b1', 'c1']
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledWith(['a1', 'b1', 'c1'])
})

// length

// push/pop/shift/unshift

// indexOf/find/includes

// iterate