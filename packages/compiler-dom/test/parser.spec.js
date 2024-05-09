import { describe, it, expect } from "vitest";
import { tokenizer, parser } from "../src";

describe("parser", () => {
  it("simple tag", () => {
    const input = "<div>hello</div>";
    const tokens = tokenizer(input);
    const ast = {
      type: "Root",
      children: [
        {
          type: "Element",
          tag: "div",
          props: {},
          children: [
            {
              type: "Text",
              children: "hello",
            },
          ],
        },
      ],
    };
    expect(parser(tokens)).toStrictEqual(ast);
  });
  it("simple tag with attribute", () => {
    const input = `<div id="app">hello</div>`;
    const tokens = tokenizer(input);
    const ast = {
      type: "Root",
      children: [
        {
          type: "Element",
          tag: "div",
          props: {
            id: "app",
          },
          children: [
            {
              type: "Text",
              children: "hello",
            },
          ],
        },
      ],
    };
    expect(parser(tokens)).toStrictEqual(ast);
  });
  it("nested tag", () => {
    const input = "<div><p>foo</p><p>bar</p></div>";
    const tokens = tokenizer(input);
    const ast = {
      type: "Root",
      children: [
        {
          type: "Element",
          tag: "div",
          props: {},
          children: [
            {
              type: "Element",
              tag: "p",
              props: {},
              children: [
                {
                  type: "Text",
                  children: "foo",
                },
              ],
            },
            {
              type: "Element",
              tag: "p",
              props: {},
              children: [
                {
                  type: "Text",
                  children: "bar",
                },
              ],
            },
          ],
        },
      ],
    };
    expect(parser(tokens)).toStrictEqual(ast);
  });
});
