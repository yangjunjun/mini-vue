import { renderer, h} from '@mini-vue/runtime-dom'
console.log('--start--')

const Child = {
    name: 'Child',
    props: {
        msg: {
            type: String,
        },
    },
    render () {
        return h('div', {}, this.msg)
    }
}
const App = h({
    name: 'App',
    data () {
        return {
            msg: 'hello mini-vue'
        }
    },
    render(proxy) {
        return h('div', {}, [
            h('button', {
                onClick () {
                    proxy.msg = 'hello' + Date.now()
                }
            }, 'clickme'),
            h(Child, {
                msg: this.msg,
            })
        ])
    }
})
renderer.render(App, document.querySelector('#app'))