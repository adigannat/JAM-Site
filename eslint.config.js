import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "app/dist",
      "functions/claimSticker/dist"
    ]
  },
  js.configs.recommended,
  {
    files: ["app/src/**/*.{ts,tsx}", "functions/claimSticker/src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          "./app/tsconfig.json",
          "./functions/claimSticker/tsconfig.json"
        ],
        tsconfigRootDir,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin
    },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "no-console": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false
        }
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unsafe-return": "off"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  prettierConfig
];
