import { renderer, h, onMounted } from '@mini-vue/runtime-dom'
console.log('--start--')

// 生命周期演示
const Child = {
    name: 'Child',
    setup () {
        onMounted(function () {
            console.log('Child mounted', this)
        })
        return () => {
            return h('div', null, 'child')
        }
    }
}
const App = h({
    name: 'App',
    data () {
        return {
            num: 0
        }
    },
    setup () {
        onMounted(function () {
            console.log('App mounted', this)
        })
    },
    render(proxy) {
        return h('div', {}, [
            h('p', {}, this.num),
            h(Child)
        ])
    }
})

renderer.render(App, document.querySelector('#app'))