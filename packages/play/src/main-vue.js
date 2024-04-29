import { createApp, h, Teleport, onMounted } from "./vue.runtime.esm-browser";
console.log("--start--");

// 生命周期演示
// <template>
//   <div>
//     <button @click="changeFlag">click</button>
//     <Teleport v-if="flag" to="body">
//       <div>teleport</div>
//     </Teleport >
//     <div v-else>else</div>
//     <div>end</div>
//   </div>
// </template>

const Child1 = {
  name: "Child1",
  setup() {
    onMounted(function () {
      console.log("Child mounted", this);
    });
    return () => {
      return h("div", null, "child1");
    };
  },
};
const Child2 = {
  name: "Child2",
  setup() {
    onMounted(function () {
      console.log("Child mounted", this);
    });
    return () => {
      return h("div", null, "child2");
    };
  },
};
const App = {
  name: "App",
  data() {
    return {
      flag: true,
    };
  },
  render(proxy) {
    return h("div", {}, [
      h(
        "button",
        {
          onClick() {
            proxy.flag = !proxy.flag;
          },
        },
        "click",
      ),
      proxy.flag
        ? h(
            Teleport,
            {
              to: "body",
            },
            [h("div", null, "Teleport")],
          )
        : h("div", null, "else"),
      h("div", null, "end"),
    ]);
  },
};

createApp(App).mount(document.querySelector("#app"));
