const nextFrame = (fn) => requestAnimationFrame(fn)

const Transition = {
  __isTransition: true,
  setup(props, { slots }) {

    const innerVNode = slots.default()

    innerVNode.transition = {
      beforeEnter(el) {
          el.classList.add('enter-from')
          el.classList.add('enter-active')
      },
      enter(el) {
        nextFrame(() => {
          // 移除 enter-from 类，添加 enter-to 类
          el.classList.remove('enter-from')
          el.classList.add('enter-to')
          // 监听 transitionend 事件完成收尾工作
          el.addEventListener('transitionend', () => {
            el.classList.remove('enter-to')
            el.classList.remove('enter-active')
          })
        })
      },
      leave(el, performRemove) {
        el.classList.add('leave-from')
        el.classList.add('leave-active')
        document.body.offsetHeight
        // 在下一帧修改状态
        nextFrame(() => {
          // 移除 leave-from 类，添加 leave-to 类
          el.classList.remove('leave-from')
          el.classList.add('leave-to')
          // 监听 transitionend 事件完成收尾工作
          el.addEventListener('transitionend', () => {
            el.classList.remove('leave-to')
            el.classList.remove('leave-active')
            // 调用 transition.leave 钩子函数的第二个参数，完成 DOM 元素的卸载
            performRemove()
          })
        })
      }
    }

    return () => innerVNode
  }
}

export {
    Transition,
}