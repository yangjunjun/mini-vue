import { renderer, h} from '@mini-vue/runtime-dom'
console.log('--start--')
// 自定义事件
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
const App = h({
    name: 'App',
    data () {
        return {
            num: 0
        }
    },
    render(proxy) {
        return h('div', {}, [
            h('p', {}, this.num),
            h(Child, {
                onClick: () => {
                    proxy.num++
                },
            })
        ])
    }
})
renderer.render(App, document.querySelector('#app'))