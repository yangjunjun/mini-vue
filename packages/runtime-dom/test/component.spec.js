import { describe, it, expect, beforeEach } from "vitest";
import { renderer } from '../src/index.js'

// @vitest-environment jsdom

describe('Component', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('diff type', () => {
        const container = document.body
        const n1 = {
            type: {
                render () {
                    return {
                        type: 'div',
                        children: 'foo',
                    }
                }
            }
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div>foo</div>') 
        const n2 = {
            type: {
                render () {
                    return {
                        type: 'div',
                        children: 'bar',
                    }
                }
            }
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div>bar</div>')     
        const n3 = {
            type: {
                render () {
                    return {
                        type: 'p',
                        children: 'bar',
                    }
                }
            }
        }
        renderer.render(n3, container)
        expect(container.innerHTML).toEqual('<p>bar</p>')    
        const n4 = {
            type: {
                render () {
                    return null
                }
            }
        }
        renderer.render(n4, container)
        expect(container.innerHTML).toEqual('')                       
    })
    it('same type', () => {
        const container = document.body
        const Comp = {
            render () {
                return {
                    type: 'div',
                    children: 'foo',
                }
            }
        }
        const n1 = {
            type: Comp
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div>foo</div>') 
        Comp.render = () => {
            return  {
                type: 'div',
                children: 'bar',
            }
        }
        const n2 = {
            type: Comp
        }
        renderer.render(n2, container)
        expect(container.innerHTML).toEqual('<div>bar</div>')  

        Comp.render = () => {
            return null
        }
        const n3 = {
            type: Comp
        }
        renderer.render(n3, container)
        expect(container.innerHTML).toEqual('')                     
    })
})

describe('Component - state', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('basic', () => {
        const container = document.body
        const Comp = {
            name: 'test',
            data () {
                return {
                    num: 0,
                }
            },
            render () {
                return {
                    type: 'div',
                    children: this.num,
                }
            }
        }
        const n1 = {
            type: Comp
        }
        renderer.render(n1, container)
        expect(container.innerHTML).toEqual('<div>0</div>') 
    })
    it('change', () => {
        const container = document.body
        const Comp = {
            name: 'test',
            data () {
                return {
                    num: 0,
                }
            },
            methods: {
                increase () {
                    this.num++
                },
                decrease () {
                    this.num--
                },
            },
            render (proxy) {
                return {
                    type: 'div',
                    children: [{
                        type: 'p',
                        props: {
                            id: 'target',
                        },
                        children: this.num,
                    }, {
                        type: 'button',
                        props: {
                            id: 'increase',
                            onClick () {
                                proxy.increase()
                            }
                        },
                        children: 'increase',
                    }, {
                        type: 'button',
                        props: {
                            id: 'decrease',
                            onClick () {
                                proxy.decrease()
                            }
                        },
                        children: 'decrease',
                    }]
                }
            }
        }
        const n1 = {
            type: Comp
        }
        renderer.render(n1, container)
        const target = container.querySelector('#target')
        expect(target.innerHTML).toEqual('0') 
        const btnIncrease = container.querySelector('#increase')
        btnIncrease.click()
        expect(target.innerHTML).toEqual('1')

        const btnDecrease = container.querySelector('#decrease')
        btnDecrease.click()
        expect(target.innerHTML).toEqual('0')        
    })    
})