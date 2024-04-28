import { renderer, h, KeepAlive, reactive, onMounted} from '@mini-vue/runtime-dom'
console.log('--start--')

const App = {
    name: 'app',
    setup () {
        onMounted(() => {
            console.log('onMounted')
        })
        const state = reactive({
            flag: true,
        })
        return () => {
            return h('div', null, [
                h('button', {
                    onClick() {
                        state.flag = !state.flag
                    }
                }, 'click'),
                state.flag ? h(KeepAlive, null, {
                    default () {
                        return h('div', {id: 'target'}, 'hello')
                    }
                }) : null
            ])
        }
    },
}

renderer.render(h(App), document.querySelector('#app'))