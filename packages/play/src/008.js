import { renderer, h, KeepAlive, onMounted, onUnmounted} from '@mini-vue/runtime-dom'
console.log('--start--')

// keep-alive 演示
/**
 * <keep-alive>
 *   <div v-if="true">true</div>
 *   <div v-else>false</div>
 * </keep-alive>
 */
const Child1 = {
    name: 'Child1',
    setup () {
        onMounted(function () {
            console.log('Child1 mounted', this)
        })
        onUnmounted(function () {
            console.log('Child1 unmounted', this)
        })         
        return () => {
            return h('input', {
                value: 'child1'
            })
        }
    }
}
const Child2 = {
    name: 'Child2',
    setup () {
        onMounted(function () {
            console.log('Child2 mounted', this)
        })
        onUnmounted(function () {
            console.log('Child2 unmounted', this)
        })        
        
        return () => {
            return h('input', {
                value: 'child2'
            })
        }
    }
}
const App = {
    name: 'App',
    data () {
        return {
            flag: true
        }
    },
    setup () {
        onMounted(function () {
            console.log('App mounted', this)
        })
    },
    render(proxy) {
        return h('div', {}, [
            h('button', {
                onClick () {
                    proxy.flag = !proxy.flag
                }
            }, 'click'),
            // proxy.flag ? h(Child1) : h(Child2),
            h(KeepAlive, null, {
                default () {
                    return proxy.flag ? h(Child1) : h(Child2)
                }
            })
            
        ])
    }
}

renderer.render(h(App), document.querySelector('#app'))