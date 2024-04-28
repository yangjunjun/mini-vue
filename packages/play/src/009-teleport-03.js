import { renderer, h, Teleport, reactive } from '@mini-vue/runtime-dom'
console.log('--start--')

// 生命周期演示
/**
 * <keep-alive>
 *   <div v-if="true">true</div>
 *   <div v-else>false</div>
 * </keep-alive>
 */
const Inner = {
    name: 'Inner',
    setup() {
        return () => {
            return h('div', null, 'inner')
        }
    }
}
const Child = {
    name: 'Child',
    setup() {
        const state = reactive({
            flag: true,
        })

        return () => {
            return h('div', null, [
                h('button', {
                    onClick() {
                        state.flag = !state.flag
                    }
                }, 'child'),
                h(Teleport, {
                    to: 'body',
                }, [
                    h(Inner),
                    h('div', null, state.flag)
                ]
                )
            ])
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
    render(proxy) {
        return h('div', {}, [
            h('button', {
                onClick () {
                    proxy.flag = !proxy.flag
                }
            }, 'click'),
            h(Teleport, {
                to: 'body',
            }, [
                 h('div', null, 'Teleport'),
                 h('div', null, proxy.flag),
            ]) ,
            h('div', null, 'end'),
        ])
    }
}

renderer.render(h(App), document.querySelector('#app'))