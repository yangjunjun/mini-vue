import { renderer, h, Text } from "@mini-vue/runtime-dom";
// slot 测试
console.log("--start--");

const Child = {
  name: "Child",
  render(proxy) {
    return h("div", null, [
      h("div", { class: "header" }, [proxy.$slot.header()]),
      h("div", { class: "body" }, [proxy.$slot.default()]),
      h("div", { class: "footer" }, [proxy.$slot.footer()]),
    ]);
  },
};
const App = h({
  name: "App",
  data() {
    return {
      num: 0,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, this.num),
      h(Child, null, {
        header() {
          return h(Text, null, "header");
        },
        default() {
          return h(Text, null, "body");
        },
        footer() {
          return h(Text, null, "footer");
        },
      }),
    ]);
  },
});
renderer.render(App, document.querySelector("#app"));
