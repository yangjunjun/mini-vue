import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["scripts/**/*.js", "packages/**/*.js"],
    ignores: ["vue-source/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
      //   reportUnusedDisableDirectiveSeverity: "off",
    },
    ...js.configs.recommended,
    rules: {
      "no-unused-vars": "off",
    },
  },
];
