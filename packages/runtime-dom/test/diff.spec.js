import { describe, it, expect, beforeEach } from "vitest"
import { renderer } from '../src/index.js'

// @vitest-environment jsdom

describe('diff test', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('same order', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            children: [
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
                { type: 'p', children: '3', key: 3 }
            ]
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div><p>1</p><p>2</p><p>3</p></div>')

        const n2 = {
            type: 'div',
            children: [
                { type: 'p', children: 'a', key: 1 },
                { type: 'p', children: 'b', key: 2 },
                { type: 'p', children: 'c', key: 3 }
            ]
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div><p>a</p><p>b</p><p>c</p></div>')
    })
    it('diff order same children', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            children: [
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
                { type: 'p', children: '3', key: 3 }
            ]
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div><p>1</p><p>2</p><p>3</p></div>')

        const n2 = {
            type: 'div',
            children: [
                { type: 'p', children: '3', key: 3 },
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
            ]
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div><p>3</p><p>1</p><p>2</p></div>')
    })
    it('diff order diff children', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            children: [
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
                { type: 'p', children: '3', key: 3 }
            ]
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div><p>1</p><p>2</p><p>3</p></div>')

        const n2 = {
            type: 'div',
            children: [
                { type: 'p', children: '31', key: 3 },
                { type: 'p', children: '2', key: 2 },
                { type: 'p', children: '1', key: 1 },
            ]
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div><p>31</p><p>2</p><p>1</p></div>')
    })
    // 新 vnode children 变多
    it('diff order more children', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            children: [
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
                { type: 'p', children: '3', key: 3 }
            ]
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div><p>1</p><p>2</p><p>3</p></div>')

        const n2 = {
            type: 'div',
            children: [
                { type: 'p', children: '3', key: 3 },
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '4', key: 4 },
                { type: 'p', children: '2', key: 2 },
            ]
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div><p>3</p><p>1</p><p>4</p><p>2</p></div>')
    })
    it('diff order more children, new at first', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            children: [
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
                { type: 'p', children: '3', key: 3 }
            ]
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div><p>1</p><p>2</p><p>3</p></div>')

        const n2 = {
            type: 'div',
            children: [
                { type: 'p', children: '4', key: 4 },
                { type: 'p', children: '3', key: 3 },
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
            ]
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div><p>4</p><p>3</p><p>1</p><p>2</p></div>')
    })
    // 新 vnode children 变少
    it('diff order less children', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            children: [
                { type: 'p', children: '1', key: 1 },
                { type: 'p', children: '2', key: 2 },
                { type: 'p', children: '3', key: 3 }
            ]
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div><p>1</p><p>2</p><p>3</p></div>')

        const n2 = {
            type: 'div',
            children: [
                { type: 'p', children: '3', key: 3 },
                { type: 'p', children: '1', key: 1 },
            ]
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div><p>3</p><p>1</p></div>')
    })     
})