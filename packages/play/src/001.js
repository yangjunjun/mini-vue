import { renderer, h} from '@mini-vue/runtime-dom'
console.log('--start--')
const App = {
    name: 'App',
    render() {
        return h('div', {}, 'hello')
    }
}
renderer.render({ type: App }, document.querySelector('#app'))