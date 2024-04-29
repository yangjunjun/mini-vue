// 全局变量，存储当前正在被初始化的组件实例
let currentInstance = null;
// 该方法接收组件实例作为参数，并将该实例设置为 currentInstance
function setCurrentInstance(instance) {
  currentInstance = instance;
}
function getCurrentInstance() {
  return currentInstance;
}
function beforeMount(fn) {
  if (currentInstance) {
    currentInstance.beforeMount.push(fn);
  } else {
    console.error("beforeMount 函数只能在 setup 中调用");
  }
}

function onMounted(fn) {
  if (currentInstance) {
    currentInstance.mounted.push(fn);
  } else {
    console.error("onMounted 函数只能在 setup 中调用");
  }
}

function onBeforeUpdate(fn) {
  if (currentInstance) {
    currentInstance.beforeUpdate.push(fn);
  } else {
    console.error("onBeforeUpdate 函数只能在 setup 中调用");
  }
}

function onUpdated(fn) {
  if (currentInstance) {
    currentInstance.updated.push(fn);
  } else {
    console.error("onUpdated 函数只能在 setup 中调用");
  }
}

function onBeforeUnmount(fn) {
  if (currentInstance) {
    currentInstance.beforeUnmount.push(fn);
  } else {
    console.error("onBeforeUnmount 函数只能在 setup 中调用");
  }
}

function onUnmounted(fn) {
  if (currentInstance) {
    currentInstance.unmounted.push(fn);
  } else {
    console.error("onUnmounted 函数只能在 setup 中调用");
  }
}

export {
  currentInstance,
  setCurrentInstance,
  getCurrentInstance,
  beforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
};
