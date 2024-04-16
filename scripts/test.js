const path = require('path')
const list = [
    {
        "name": "mini-vue",
        "version": "1.0.0",
        "path": "/home/yangjunye/projects/mini-vue/mini-vue",
        "private": false
    },
    {
        "name": "@mini-vue/reactive",
        "version": "0.0.1",
        "path": "/home/yangjunye/projects/mini-vue/mini-vue/packages/reactive",
        "private": false
    },
    {
        "name": "@mini-vue/shared",
        "version": "1.0.0",
        "path": "/home/yangjunye/projects/mini-vue/mini-vue/packages/shared",
        "private": false
    }
]
console.log('__dirname', __dirname)
const result = list.map((m) => {
    return path.relative(__dirname, m.path)
})
console.log(result)