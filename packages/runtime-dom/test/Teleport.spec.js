import { describe, it, expect, beforeEach } from "vitest";
import { renderer, Teleport, h, reactive} from '../src/index.js'

// @vitest-environment jsdom

describe('Teleport', () => {
    
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('basic', () => {       
        const container = document.body 
        const n1 = {
            type: 'div', 
            props: {
                id: 'wrap',
            },
            children: [
                h(Teleport, {
                    to: container
                }, [
                    h('div', {id: 'target'})
                ])
            ]
        }
        renderer.render(n1, container)
        const wrap = container.querySelector('#wrap')
        expect(wrap.querySelector('#target')).toBeFalsy()
        expect(container.querySelector('#target')).toBeTruthy()
    })   
    it('change to', () => {
        const container = document.body
        const wrap1 = document.createElement('div')
        wrap1.id = 'wrap1'
        const wrap2 = document.createElement('div')
        wrap2.id = 'wrap2'        
        container.appendChild(wrap1)
        container.appendChild(wrap2)

        const n1 = {
            name: 'App',
            setup () {
                const state = reactive({
                    to: '#wrap1'
                })
                return () => {
                    return h('div', null, [
                        h('button', {
                            onClick () {
                                state.to = '#wrap2'
                            }
                        }),
                        h(Teleport, {
                            to: state.to,
                        }, [ h('div', {id: 'target'})])
                    ])
                }
            }
        }
        renderer.render(h(n1), container)
        expect(wrap1.querySelector('#target')).toBeTruthy()
        expect(wrap2.querySelector('#target')).toBeFalsy()
        // change props to
        const button = container.querySelector('button')
        button.click()
        expect(wrap1.querySelector('#target')).toBeFalsy()
        expect(wrap2.querySelector('#target')).toBeTruthy()
    })  
})