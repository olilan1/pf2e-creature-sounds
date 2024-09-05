import globals from "globals";
import pluginJs from "@eslint/js";


export default [
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.jquery,
          game: "readonly",
          ui: "readonly",
          Hooks: "readonly",
          canvas: "readonly"
        }
      }
    },
  pluginJs.configs.recommended,
];