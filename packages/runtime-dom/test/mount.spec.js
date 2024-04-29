import { describe, it, expect, beforeEach } from "vitest";
import { renderer } from "../src/index.js";

// @vitest-environment jsdom

describe("mount", () => {
  beforeEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    delete document.body._vnode;
  });
  it("no children", () => {
    const container = document.body;
    const n1 = {
      type: "div",
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div></div>");
  });
  it("text children", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: "foo",
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div>foo</div>");
  });
  it("array children", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo",
        },
      ],
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div><p>foo</p></div>");
  });
  it("multiple array children", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo",
        },
        {
          type: "p",
          children: "bar",
        },
      ],
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div><p>foo</p><p>bar</p></div>");
  });
  it("deep array children", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: [
        {
          type: "p",
          children: [
            {
              type: "ul",
              children: [
                {
                  type: "li",
                  children: 1,
                },
                {
                  type: "li",
                  children: 2,
                },
                {
                  type: "li",
                  children: 3,
                },
              ],
            },
          ],
        },
        {
          type: "p",
          children: "bar",
        },
      ],
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual(
      "<div><p><ul><li>1</li><li>2</li><li>3</li></ul></p><p>bar</p></div>",
    );
  });
});
