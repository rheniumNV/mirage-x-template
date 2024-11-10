import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactJSXRuntime from "eslint-plugin-react/configs/jsx-runtime.js";

export default [
  {
    files: ["*.ts", "*.tsx"],
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": eslintPluginReactHooks,
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ...pluginReactConfig,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginReactJSXRuntime,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/hook-use-state": "error",
      "react/jsx-fragments": "error",
      "react/jsx-sort-props": "warn",
      "react/jsx-pascal-case": "error",
      "react/no-danger": "error",
    },
  },
  eslintConfigPrettier,
];
