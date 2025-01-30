import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node
    },
    env: {
      node: true,
      es2022: true
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
