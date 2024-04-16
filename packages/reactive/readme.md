# vue reactive 实现

## 目标

1. 实现和 vue reactive 官方一样的 api


## 要求

1. esm
2. 测试用例
3. typescript

## 特殊情况处理

### object
- v0.0.1 实现简单的 reactive 和 effect 
- v0.0.2 增加测试
- v0.0.3 修复 effect 里读取多次值时，会触发多次的bug
- v0.0.4 使用 WeakMap 代替 Map 解决可能的内存泄漏问题
- v0.0.5 使用 Reflect 解决当响应数据有 getter 时的问题
    - getter 问题
    - set 问题执行两次 ?
- v0.0.6 effect 函数有分支时重新 track 依赖的问题
    - 重新 track 依赖
    - 删除 旧的依赖 ?
- v0.0.7 无限递归
- v0.0.8 深响应
- v0.0.8 嵌套 effect

### map && set

### array



1. 避免污染

## 对象读写分析

- Object
    - read
        1. obj.key
        4. key in obj
        2. for (let key in obj)
        3. Object.keys
    - write
        1. obj.key = 'newValue'
        2. delete obj.key        
- Array
    - read
        1. arr[0]
        2. '0' in arr
        3. arr.length
        4. arr.forEach
        5. arr.map
        6. arr.find/arr.index/arr.includes
        7. for( let key of arr)
    - write
        1. arr[0] = 'newVal'
        2. arr.length = 5
        3. arr.push/arr.pop/arr.shift/arr.unshift
- Map
    -  read
        1. map.get('name')
        2. map.has('name')
        3. map.size
        4. map.forEach
        5. map.keys
        6. map.values
        7. map.entries
        8. for (let key of map)
    -  write
        1. map.set('name', 'newVal') 
        2. map.delete('name')
        3. map.clear()
- Set
    -  read
        2. map.has('name')
        3. map.size
        4. map.forEach
        5. map.keys
        6. map.values
        7. map.entries
        8. for (let key of map)
    -  write
        1. map.add('newVal') 
        2. map.delete('val')
        3. map.clear()

## 衍生相应对象

1. ref
2. computed
3. watch

## 缺陷

1. getter/setter
3. array
    push,shift 可能触发多次
3. map
    1. has
    2. map size
        set 也触发 iterate 
4. 嵌套 effect 
    重复复发
## 属性

```ts
export enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate',
}

export enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear',
}

export enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
}
```