import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderer, KeepAlive, h, reactive, onMounted } from "../src/index.js";

// @vitest-environment jsdom

describe("KeepAlive", () => {
  beforeEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    delete document.body._vnode;
  });
  it("basic", () => {
    const container = document.body;
    const fn = vi.fn();
    const n1 = {
      name: "app",
      setup() {
        onMounted(fn);
        const state = reactive({
          flag: true,
        });
        return () => {
          return h("div", null, [
            h("button", {
              onClick() {
                state.flag = !state.flag;
              },
            }),
            state.flag
              ? h(KeepAlive, null, {
                  default() {
                    return h("div", { id: "target" }, "hello");
                  },
                })
              : null,
          ]);
        };
      },
    };
    renderer.render(h(n1), container);
    let target = container.querySelector("#target");
    expect(target.innerHTML).toEqual("hello");
    expect(fn).toBeCalledTimes(1);

    // click button
    const button = container.querySelector("button");
    button.click();
    target = container.querySelector("#target");
    expect(target).toBeFalsy();
    expect(fn).toBeCalledTimes(1);

    // click button
    button.click();
    target = container.querySelector("#target");
    expect(target).toBeTruthy();
    expect(target.innerHTML).toEqual("hello");
    expect(fn).toBeCalledTimes(1);
  });
});
