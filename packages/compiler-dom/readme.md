# @mini-vue/compiler-dom

https://github.com/greim/html-tokenizer

## 功能

转换 html 至 ast

```html
<div>
  <h1 v-if="ok">vue</h1>
</div>
```

```js
const ast = {
  // 逻辑根节点
  type: 'Root',
  children: [
    // div 标签节点
    {
      type: 'Element',
      tag: 'div',
      children: [
        // h1 标签节点
        {
          type: 'Element',
          tag: 'h1',
          props: [
            // v-if 指令节点
            {
              type: 'Directive', // 类型为 Directive 代表指令
              name: 'if'，       // 指令名称为 if，不带有前缀 v-
              exp: {
                // 表达式节点
                type: 'Expression',
                content: 'ok'
              }
            }
          ]
        }
      ]
    }
  ]
}
```

```js
const render = (context) => {
  return h("div", null, [context.ok ? h("h1", null, "Vue Template") : null]);
};
```
