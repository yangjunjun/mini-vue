import { describe, it, expect, beforeEach } from "vitest";
import { renderer, Fragment } from "../src/index.js";

// @vitest-environment jsdom

describe("Fragment", () => {
  beforeEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    delete document.body._vnode;
  });
  it("basic", () => {
    const container = document.body;
    const n1 = {
      type: Fragment,
      children: [
        {
          type: "div",
          children: "foo",
        },
        {
          type: "div",
          children: "bar",
        },
      ],
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div>foo</div><div>bar</div>");

    const n2 = {
      type: Fragment,
      children: [
        {
          type: "div",
          children: "foo1",
        },
        {
          type: "div",
          children: "bar1",
        },
      ],
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<div>foo1</div><div>bar1</div>");

    const n3 = {
      type: Fragment,
      children: [
        {
          type: "div",
          children: "foo1",
        },
      ],
    };
    renderer.render(n3, container);
    expect(container.innerHTML).toEqual("<div>foo1</div>");

    const n4 = {
      type: Fragment,
      children: [],
    };
    renderer.render(n4, container);
    expect(container.innerHTML).toEqual("");
  });
  it("children", () => {
    const container = document.body;
    const n1 = {
      type: "ul",
      children: [
        {
          type: Fragment,
          children: [
            {
              type: "li",
              children: "foo",
            },
            {
              type: "li",
              children: "bar",
            },
          ],
        },
      ],
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<ul><li>foo</li><li>bar</li></ul>");

    const n2 = {
      type: "ul",
      children: [
        {
          type: Fragment,
          children: [
            {
              type: "li",
              children: "foo1",
            },
            {
              type: "li",
              children: "bar1",
            },
          ],
        },
      ],
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<ul><li>foo1</li><li>bar1</li></ul>");
    const n3 = {
      type: "ul",
      children: [
        {
          type: Fragment,
          children: [
            {
              type: "li",
              children: "foo1",
            },
          ],
        },
      ],
    };
    renderer.render(n3, container);
    expect(container.innerHTML).toEqual("<ul><li>foo1</li></ul>");
    const n4 = {
      type: "ul",
      children: [
        {
          type: Fragment,
          children: [],
        },
      ],
    };
    renderer.render(n4, container);
    expect(container.innerHTML).toEqual("<ul></ul>");
  });
});
