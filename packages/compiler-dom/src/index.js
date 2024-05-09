const tokenizer = (input) => {
  const tokens = [];
  let index = 0;
  while (index < input.length) {
    let char = input[index];
    // type: < > / =
    const PUNCTUATION_REGEXP = /<|>|=|\//;
    if (PUNCTUATION_REGEXP.test(char)) {
      tokens.push({
        type: "punctuation",
        value: char,
      });
      index++;
      continue;
    }
    // type: whitespace
    const WHITESPACE_REGEXP = /\s/;
    if (WHITESPACE_REGEXP.test(char)) {
      index++;
      continue;
    }
    // name or directive
    const NAME_REGEXP = /[a-z]/i;
    if (NAME_REGEXP.test(char)) {
      let value = "";
      let isDirective = false;
      while (NAME_REGEXP.test(char) || char === "-") {
        if (char === "-") {
          isDirective = true;
        }
        value += char;
        char = input[++index];
      }
      tokens.push({
        type: isDirective ? "directive" : "name",
        value: value,
      });
      continue;
    }
    // type: string
    const STRING_QUOTE_REGEXP = /'|"|`/;
    let match = null;
    if ((match = char.match(STRING_QUOTE_REGEXP))) {
      let matchQuote = match[0];
      let value = "";
      char = input[++index];
      while (char !== matchQuote) {
        value += char;
        char = input[++index];
      }
      tokens.push({
        type: "string",
        value: value,
      });
      index++;
      continue;
    }
    throw new Error("unknow char", char);
  }
  return tokens;
};
const parser = (tokens) => {
  let index = 0;
  const walk = () => {
    let token = tokens[index];
    // tag start
    if (token.value === "<") {
      token = tokens[++index];
      const node = {
        type: "Element",
        tag: token.value,
        props: {},
        children: [],
      };
      let isTagStartEnd = false;

      token = tokens[++index];
      // tag start
      let key = "";
      let keyHasValue = false;
      while (!(token.value === "<" && tokens[index + 1].value === "/")) {
        // 结束开始标签
        if (token.value === ">") {
          isTagStartEnd = true;
          token = tokens[++index];
          continue;
        }
        // 子标签
        if (token.value === "<") {
          node.children.push(walk());
          continue;
        }
        if (token.type === "name") {
          if (isTagStartEnd) {
            node.children.push(walk());
          } else {
            key = token.value;
          }
          token = tokens[++index];
          continue;
        }
        if (token.value === "=") {
          keyHasValue = true;
          token = tokens[++index];
          continue;
        }
        if (token.type === "string") {
          if (keyHasValue) {
            node.props[key] = token.value;
            keyHasValue = false;
          }
          token = tokens[++index];
          continue;
        }
        throw new Error(`unknow token", ${token.type}: ${token.value}`);
      }
      // tag children
      // tag end
      index = index + 4;
      return node;
    } else if (token.type === "name") {
      return {
        type: "Text",
        children: token.value,
      };
    } else {
      throw new Error(`unknow token", ${token.type}: ${token.value}`);
    }
  };
  const ast = {
    type: "Root",
    children: [],
  };
  ast.children.push(walk());
  return ast;
};

const transformer = () => {};

const padingLevel = (str, level) => {
  return str
    .trim()
    .split("\n")
    .map((item) => {
      return "  ".repeat(level) + item;
    })
    .join("\n");
};
const padingLevelExceptFirst = (str, level) => {
  return str
    .trim()
    .split("\n")
    .map((item, index) => {
      if (index === 0) {
        return item;
      } else {
        return "  ".repeat(level) + item;
      }
    })
    .join("\n");
};
const generator = (node, level = 0) => {
  switch (node.type) {
    case "Root":
      return `[
${node.children.map((childNode) => generator(childNode, level + 1)).join(",")}
]`;
    case "Element":
      return padingLevel(
        `
{
  type: "${node.tag}", 
  props: ${padingLevelExceptFirst(JSON.stringify(node.props, null, 2), 1)},
  children: [
${node.children.map((childNode) => generator(childNode, level + 1)).join(",\n")}
  ]
}`,
        level,
      );
    case "Text":
      return `${padingLevel(`"${node.children}"`, level)}`;
    default:
      throw new Error(`unknow node: ${node.type}: ${node.value}`);
  }
};

export { tokenizer, parser, transformer, generator };
