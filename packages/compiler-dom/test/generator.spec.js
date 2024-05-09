import { describe, it, expect } from "vitest";
import { tokenizer, parser, generator } from "../src";

describe("generator", () => {
  it("simple tag", () => {
    const input = "<div>hello</div>";
    const tokens = tokenizer(input);
    const ast = parser(tokens);
    const ouput = generator(ast);
    const target = `
[
  {
    type: "div", 
    props: {},
    children: [
      "hello"
    ]
  }
]`.trim();
    expect(ouput).toEqual(target);
  });

  it("simple tag with attribute", () => {
    const input = `<div id="app">hello</div>`;
    const tokens = tokenizer(input);
    const ast = parser(tokens);
    const ouput = generator(ast);
    const target = `
[
  {
    type: "div", 
    props: {
      "id": "app"
    },
    children: [
      "hello"
    ]
  }
]`.trim();
    expect(ouput).toEqual(target);
  });
  it("nested tag", () => {
    const input = "<div><p>foo</p><p>bar</p></div>";
    const tokens = tokenizer(input);
    const ast = parser(tokens);
    const ouput = generator(ast);
    const target = `
[
  {
    type: "div", 
    props: {},
    children: [
      {
        type: "p", 
        props: {},
        children: [
            "foo"
        ]
      },
      {
        type: "p", 
        props: {},
        children: [
            "bar"
        ]
      }
    ]
  }
]`.trim();
    expect(ouput).toEqual(target);
  });
});
