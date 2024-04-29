import { describe, it, expect, beforeEach } from "vitest";
import { renderer, Text } from "../src/index.js";

// @vitest-environment jsdom

describe("Text", () => {
  beforeEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    delete document.body._vnode;
  });
  it("basic", () => {
    const container = document.body;
    const n1 = {
      type: Text,
      children: "foo",
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("foo");

    const n2 = {
      type: Text,
      children: "bar",
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("bar");
    const n3 = {
      type: Text,
      // children: '',
    };
    renderer.render(n3, container);
    expect(container.innerHTML).toEqual("");
  });
  it("children", () => {
    const container = document.body;
    const n1 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo",
        },
        {
          type: Text,
          children: "bar",
        },
        {
          type: "p",
          children: "baz",
        },
      ],
    };
    renderer.render(n1, container);
    expect(container.innerHTML).toEqual("<div><p>foo</p>bar<p>baz</p></div>");

    const n2 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo",
        },
        {
          type: Text,
          children: "bar1",
        },
        {
          type: "p",
          children: "baz",
        },
      ],
    };
    renderer.render(n2, container);
    expect(container.innerHTML).toEqual("<div><p>foo</p>bar1<p>baz</p></div>");
    const n3 = {
      type: "div",
      children: [
        {
          type: "p",
          children: "foo",
        },
        {
          type: "p",
          children: "baz",
        },
      ],
    };
    renderer.render(n3, container);
    expect(container.innerHTML).toEqual("<div><p>foo</p><p>baz</p></div>");
  });
});
