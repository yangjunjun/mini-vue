import { createApp, h, KeepAlive, onMounted } from './vue.runtime.esm-browser'
// import { renderer, h, KeepAlive, onMounted } from '@mini-vue/runtime-dom'
console.log('--start--')

// 生命周期演示
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
            console.log('Child mounted', this)
        })
        return () => {
            return h('div', null, 'child1')
        }
    }
}
const Child2 = {
    name: 'Child2',
    setup () {
        onMounted(function () {
            console.log('Child mounted', this)
        })
        return () => {
            return h('div', null, 'child2')
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
            h(KeepAlive, null, {
                default () {
                    return proxy.flag ? h(Child1) : h(Child2)
                }
            })
            
        ])
    }
}

createApp(h(App)).mount(document.querySelector('#app'))