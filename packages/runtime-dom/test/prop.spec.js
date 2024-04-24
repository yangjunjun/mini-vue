import { describe, it, expect, beforeEach } from "vitest";
import { renderer } from '../src/index.js'

// @vitest-environment jsdom

// 属性测试( 分别有 mount, patch, unmount)
// 1.class
// 2.style
// 3.attr
// 4.prop
// 5.event

describe('props - class', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('class mount', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                class: 'foo',
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.classList.contains('foo')).toBe(true)
    })
    it('class patch', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                class: 'foo',
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.classList.contains('foo')).toBe(true)

        const n2 = {
            type: 'div',
            props: {
                class: 'bar',
            },
        }
        renderer.render(n2, container)
        expect(target.classList.contains('foo')).toBe(false)
        expect(target.classList.contains('bar')).toBe(true)
    })
    it('class unmount', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                class: 'foo',
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.classList.contains('foo')).toBe(true)

        const n2 = {
            type: 'div',
            props: {},
        }
        renderer.render(n2, container)
        expect(target.classList.contains('foo')).toBe(false)
    })
    it('class multiple', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                class: 'foo bar',
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.classList.contains('foo')).toBe(true)
        expect(target.classList.contains('bar')).toBe(true)

        const n2 = {
            type: 'div',
            props: {
                class: 'bar baz',
            },
        }
        renderer.render(n2, container)
        expect(target.classList.contains('foo')).toBe(false)
        expect(target.classList.contains('bar')).toBe(true)        
        expect(target.classList.contains('baz')).toBe(true)        
    })
})

describe('props - style', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('style mount', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                style:  {
                    color: 'red',
                }
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.style.getPropertyValue('color')).toBe('red')
    })
    it('style patch', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                style:  {
                    color: 'red',
                }
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.style.getPropertyValue('color')).toBe('red')

        const n2 = {
            type: 'div',
            props: {
                style:  {
                    color: 'blue',
                }
            },
        }
        renderer.render(n2, container)
        expect(target.style.getPropertyValue('color')).toBe('blue')
    })
    it('style unmount', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                style:  {
                    color: 'red',
                }
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.style.getPropertyValue('color')).toBe('red')

        const n2 = {
            type: 'div',
            props: {},
        }
        renderer.render(n2, container)
        expect(target.style.getPropertyValue('color')).toBe('')
    })
    it('style multiple', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            props: {
                style:  {
                    color: 'red',
                    width: '100px',
                }
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.style.getPropertyValue('color')).toBe('red')
        expect(target.style.getPropertyValue('width')).toBe('100px')

        const n2 = {
            type: 'div',
            props: {
                style:  {
                    color: 'blue',
                    width: '150px',
                }
            },
        }
        renderer.render(n2, container)
        expect(target.style.getPropertyValue('color')).toBe('blue')
        expect(target.style.getPropertyValue('width')).toBe('150px')     
    })
    it('style camel name', () => {
        const container = document.body
        // mount
        const n1 = {
            type: 'div',
            props: {
                style:  {
                    color: 'red',
                    backgroundColor: 'red',
                }
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.style.getPropertyValue('color')).toBe('red')
        expect(target.style.getPropertyValue('background-color')).toBe('red')
        // patch
        const n2 = {
            type: 'div',
            props: {
                style:  {
                    color: 'blue',
                    backgroundColor: 'blue',
                }
            },
        }
        renderer.render(n2, container)
        expect(target.style.getPropertyValue('color')).toBe('blue')
        expect(target.style.getPropertyValue('background-color')).toBe('blue')  
        // unmount   
        const n3 = {
            type: 'div',
            props: {},
        }
        renderer.render(n3, container)
        expect(target.style.getPropertyValue('color')).toBe('')
        expect(target.style.getPropertyValue('background-color')).toBe('')          
    })    
})

describe('props - attr', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('basic', () => {
        const container = document.body
        // mount
        const n1 = {
            type: 'div',
            props: {
                id: 'foo',
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('div')
        expect(target.getAttribute('id')).toBe('foo')
        // patch
        const n2 = {
            type: 'div',
            props: {
                id: 'bar',
            },
        }
        renderer.render(n2, container)
        expect(target.getAttribute('id')).toBe('bar')
        // unmount   
        const n3 = {
            type: 'div',
            props: {},
        }
        renderer.render(n3, container)
        expect(target.getAttribute('id')).toBe('')       
    })    
})

describe('props - domProp', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('basic', () => {
        const container = document.body
        // mount
        const n1 = {
            type: 'button',
            props: {
                disabled: true,
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('button')
        expect(target.disabled).toBe(true)
        // patch
        const n2 = {
            type: 'button',
            props: {
                disabled: false,
            },
        }
        renderer.render(n2, container)
        expect(target.disabled).toBe(false)
        // unmount   
        const n3 = {
            type: 'button',
            props: {},
        }
        renderer.render(n3, container)
        expect(target.disabled).toBe(false)      
    })    
})

describe('props - event', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('basic', () => {
        const container = document.body
        let num = 0
        // mount
        const n1 = {
            type: 'button',
            props: {
                onClick () {
                    num = 1
                }
            },
        }
        renderer.render(n1, container)
        const target = container.querySelector('button')
        target.click()
        expect(num).toBe(1)
        // patch
        const n2 = {
            type: 'button',
            props: {
                onClick () {
                    num = 10
                }
            },
        }
        renderer.render(n2, container)
        target.click()
        expect(num).toBe(10)
        // unmount   
        const n3 = {
            type: 'button',
            props: {},
        }
        renderer.render(n3, container)
        target.click()
        expect(num).toBe(10)    
    })    
})