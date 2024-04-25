import { renderer, h, reactive} from '@mini-vue/runtime-dom'
console.log('--start--')

const App = h({
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
})
renderer.render(App, document.querySelector('#app'))