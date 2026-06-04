import { nextJsConfig } from "@umq/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    ignores: ["next.config.js"],
  },
];
