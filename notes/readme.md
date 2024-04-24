# notes


## pnpm 

```sh
# 从工作空间安装 package
pnpm add --workspace @mini-vue/shared
# 递归之行命令，并传递参数给子命令
pnpm run -r test --reporter=dot --run
```

## 问题

1. 测试 dom

需安装 `jsdom`, 然后配置 `environment: jsdom`, [文档](https://vitest.dev/config/#environment)

2. 测试 dom 是需要先清除一下 dom 的缓存，代码如下：

```js
import { beforeEach } from "vitest"
describe('diff test', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete document.body._vnode
    })
}
```