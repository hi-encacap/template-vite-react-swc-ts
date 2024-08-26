/** @type {import('@eslint/js').Linter.FlatConfig[]} */

import { fixupPluginRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import pluginReactQuery from "@tanstack/eslint-plugin-query";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import pluginReactHook from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginSonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import pluginTs from "typescript-eslint";

export default pluginTs.config(
  pluginJs.configs.recommended,
  ...pluginTs.configs.strictTypeChecked,
  ...pluginTs.configs.stylisticTypeChecked,
  ...pluginReactQuery.configs["flat/recommended"],
  pluginPrettierRecommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: true,
        ecmaVersion: "latest",
        tsconfigDirName: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react: fixupPluginRules(pluginReact),
      "react-hooks": fixupPluginRules(pluginReactHook),
      "react-refresh": pluginReactRefresh,
      "jsx-a11y": pluginJsxA11y,
      sonarjs: pluginSonarjs,
    },

    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs["jsx-runtime"].rules,
      ...pluginJsxA11y.configs.recommended.rules,
      ...pluginReactHook.configs.recommended.rules,
      ...pluginSonarjs.configs.recommended.rules,

      // TODO: Remove this rule when it's fixed. (https://sonarsource.atlassian.net/browse/JS-296)
      "sonarjs/sonar-no-fallthrough": "off",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: ["node_modules/*", "*.config.*", "dist/*", "*.cjs", "*.prepare.*"],
  },
);
