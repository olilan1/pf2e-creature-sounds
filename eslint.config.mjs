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
          canvas: "readonly",
          pf2eAnimations: "readonly",
          Portal: "readonly",
          Sequencer: "readonly",
          Sequence: "readonly",
          Actor: "readonly",
          PIXI: "readonly",
          MeasuredTemplateDocument: "readonly",
          Dialog: "readonly",
          CONFIG: "readonly",
          foundry: "readonly",
          CONST: "readonly"
        }
      }
    },
  pluginJs.configs.recommended,
    {
      rules: {
        "no-unused-vars": "warn"
      }
    }
];