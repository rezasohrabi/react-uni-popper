import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import configPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import pluginImport from "eslint-plugin-import";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: {
      js,
      pluginReact,
      "react-hooks": reactHooks,
      import: pluginImport,
      "jsx-a11y": jsxA11y,
      prettier: eslintPluginPrettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: ["js/recommended", configPrettier],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.stories.ts",
      "**/*.stories.tsx",
      "**/*.test.ts",
      "**/*.test.tsx",
    ],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
