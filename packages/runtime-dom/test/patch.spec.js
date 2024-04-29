import { describe, it, expect, beforeEach } from "vitest";
import { renderer } from "../src/index.js";

// @vitest-environment jsdom

describe("simple diff", () => {
  beforeEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    delete document.body._vnode;
  });
  it("type is diff", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: "foo",
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div>foo</div>");

    const n2 = {
      type: "p",
      children: "bar",
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<p>bar</p>");
  });
  it("type is same, old string, new string", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: "foo",
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div>foo</div>");

    const n2 = {
      type: "div",
      children: "bar",
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<div>bar</div>");
  });
  it("type is same, old arr, new string", () => {
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

    const n2 = {
      type: "div",
      children: "bar",
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<div>bar</div>");
  });
  it("type is same, old string, new arr", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: "bar",
    };

    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div>bar</div>");
    const n2 = {
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
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<div><p>foo</p><p>bar</p></div>");
  });
  it("type is same, old arr, new arr", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo1",
        },
        {
          type: "p",
          children: "bar1",
        },
      ],
    };

    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div><p>foo1</p><p>bar1</p></div>");
    const n2 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo2",
        },
        {
          type: "p",
          children: "bar2",
        },
      ],
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<div><p>foo2</p><p>bar2</p></div>");
  });
  it("type is same, old arr, new arr", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo1",
        },
        {
          type: "p",
          children: "bar1",
        },
      ],
    };

    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div><p>foo1</p><p>bar1</p></div>");
    const n2 = {
      type: "div",
      children: [
        {
          type: "div",
          children: "foo2",
        },
        {
          type: "p",
          children: "bar2",
        },
      ],
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual(
      "<div><div>foo2</div><p>bar2</p></div>",
    );
  });
});
