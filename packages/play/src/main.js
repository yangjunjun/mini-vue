import { renderer, h} from '@mini-vue/runtime-dom'
console.log('--start--')
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
renderer.render({ type: Comp }, document.querySelector('#app'))