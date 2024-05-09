import { describe, it, expect } from "vitest";
import { tokenizer } from "../src";

describe("tokenizer", () => {
  it("simple tag", () => {
    const input = "<div>hello</div>";
    const tokens = [
      { type: "punctuation", value: "<" },
      { type: "name", value: "div" },
      { type: "punctuation", value: ">" },
      { type: "name", value: "hello" },
      { type: "punctuation", value: "<" },
      { type: "punctuation", value: "/" },
      { type: "name", value: "div" },
      { type: "punctuation", value: ">" },
    ];
    expect(tokenizer(input)).toStrictEqual(tokens);
  });
  it("simple tag with attribute", () => {
    const input = `<div id="app">hello</div>`;
    const tokens = [
      { type: "punctuation", value: "<" },
      { type: "name", value: "div" },
      { type: "name", value: "id" },
      { type: "punctuation", value: "=" },
      { type: "string", value: "app" },
      { type: "punctuation", value: ">" },
      { type: "name", value: "hello" },
      { type: "punctuation", value: "<" },
      { type: "punctuation", value: "/" },
      { type: "name", value: "div" },
      { type: "punctuation", value: ">" },
    ];
    expect(tokenizer(input)).toStrictEqual(tokens);
  });
  it("nested tag", () => {
    const input = `<div>
        <p>foo</p>
        <p>bar</p>
    </div>`;
    const tokens = [
      { type: "punctuation", value: "<" },
      { type: "name", value: "div" },
      { type: "punctuation", value: ">" },

      { type: "punctuation", value: "<" },
      { type: "name", value: "p" },
      { type: "punctuation", value: ">" },

      { type: "name", value: "foo" },

      { type: "punctuation", value: "<" },
      { type: "punctuation", value: "/" },
      { type: "name", value: "p" },
      { type: "punctuation", value: ">" },

      { type: "punctuation", value: "<" },
      { type: "name", value: "p" },
      { type: "punctuation", value: ">" },
      { type: "name", value: "bar" },
      { type: "punctuation", value: "<" },
      { type: "punctuation", value: "/" },
      { type: "name", value: "p" },
      { type: "punctuation", value: ">" },

      { type: "punctuation", value: "<" },
      { type: "punctuation", value: "/" },
      { type: "name", value: "div" },
      { type: "punctuation", value: ">" },
    ];
    expect(tokenizer(input)).toStrictEqual(tokens);
  });
});
