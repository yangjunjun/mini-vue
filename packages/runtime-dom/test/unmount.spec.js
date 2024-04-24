import { describe, it, expect, beforeEach } from "vitest";
import { renderer } from '../src/index.js'

// @vitest-environment jsdom

describe('mount', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('text children', () => {
        const container = document.body
        const n1 = {
            type: 'div',
            children: 'foo'
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div>foo</div>')
        renderer.render(null, container)
        expect(container.innerHTML).toEqual('')
    })     
})