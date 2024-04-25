import { describe, it, expect, beforeEach } from "vitest";
import { reactive } from "@mini-vue/reactive";
import { renderer, h} from '../src/index.js'

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
})

describe('Component - state', () => {
    const container = document.body
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
    it('basic', () => {
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
    it('state change', () => {
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
    it('props', () => {
        const Child = {
            name: 'Child',
            props: {
                num: {
                    type: Number,
                },
            },
            render () {
                return h('div', {
                    id: 'child'
                }, this.num)
            }
        }
        const App = {
            name: 'App',
            data () {
                return {
                    num: 0
                }
            },
            render(proxy) {
                return h('div', {}, [
                    h('button', {
                        onClick () {
                            proxy.num = proxy.num + 1
                        }
                    }, 'clickme'),
                    h(Child, {
                        num: this.num,
                    })
                ])
            }
        }
        renderer.render(h(App), container)
        const target = container.querySelector('#child')
        expect(target.innerHTML).toEqual('0')

        const button = container.querySelector('button')
        button.click()
        expect(target.innerHTML).toEqual('1')
    }) 
    it('setup', () => {
        const Comp = {
            setup () {
                const state = reactive({
                    num: 0,
                })
                const increase = () => {
                    state.num++
                }
                return () => {
                    return h('div', null, [
                        h('button', {
                            onClick () {
                                increase()
                            }
                        }, 'click'),
                        h('div', {
                            id: 'target',
                        }, state.num)
                    ])
                }
            }
        }
        renderer.render(h(Comp), container)
        const target = container.querySelector('#target')
        expect(target.innerHTML).toEqual('0')   
        
        const button = container.querySelector('button')
        button.click()
        expect(target.innerHTML).toEqual('1')

    })   
    it('custom event', () => {
        const Child = {
            name: 'Child',
            render (proxy) {
                return h('button', {
                    onClick () {
                        proxy.emit('click')
                    }
                }, 'click')
            }
        }
        const App = {
            name: 'App',
            data () {
                return {
                    num: 0
                }
            },
            render(proxy) {
                return h('div', {}, [
                    h('p', {id: 'target'}, this.num),
                    h(Child, {
                        onClick: () => {
                            proxy.num++
                        },
                    })
                ])
            }
        }       
        renderer.render(h(App), container)
        const target = container.querySelector('#target')
        expect(target.innerHTML).toEqual('0')   
        
        const button = container.querySelector('button')
        button.click()
        expect(target.innerHTML).toEqual('1')

    })
    it('setup event', () => {
        const Child = {
            name: 'Child',
            setup (props, { emit }) {
                return () => {
                    return h('button', {
                        onClick () {
                            emit('click')
                        }
                    }, 'click')
                }
            },
        }
        const App = {
            name: 'App',
            data () {
                return {
                    num: 0
                }
            },
            render(proxy) {
                return h('div', {}, [
                    h('p', {id: 'target'}, this.num),
                    h(Child, {
                        onClick: () => {
                            proxy.num++
                        },
                    })
                ])
            }
        }       
        renderer.render(h(App), container)
        const target = container.querySelector('#target')
        expect(target.innerHTML).toEqual('0')   
        
        const button = container.querySelector('button')
        button.click()
        expect(target.innerHTML).toEqual('1')

    })    
})