import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["import", "typescript"],
  rules: {
    "no-console": ["error", { allow: ["info", "warn", "error", "table"] }],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
    "no-unused-vars": "error",
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/no-mutable-exports": "error",
    "import/no-named-default": "error",
    "import/no-self-import": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-import-type-side-effects": "error"
  }
});
