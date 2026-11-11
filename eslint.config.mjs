import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const typeMessage = "Declare types, interfaces and enums in src/types instead of code files.";

const codeStyleRules = {
  "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["error", { max: 80, skipBlankLines: true, skipComments: true }],
  "max-depth": ["error", 3],
  complexity: ["error", 12],
  "id-length": ["error", { min: 4, max: 28, properties: "never", exceptions: ["GET", "POST"] }],
  "no-console": ["error", { allow: ["warn", "error"] }],
  eqeqeq: "error",
  "no-restricted-syntax": [
    "error",
    { selector: "TSTypeAliasDeclaration", message: typeMessage },
    { selector: "TSInterfaceDeclaration", message: typeMessage },
    { selector: "TSEnumDeclaration", message: typeMessage },
    { selector: "TSTypeLiteral", message: typeMessage },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  { rules: codeStyleRules },
  {
    files: ["src/types/**/*.ts", "**/*.d.ts"],
    rules: { "no-restricted-syntax": "off", "max-lines": "off" },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: { "max-lines-per-function": "off" },
  },
  {
    files: ["scripts/**/*.ts"],
    rules: { "no-console": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);

export default eslintConfig;
