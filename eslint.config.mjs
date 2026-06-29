import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: {
      "react-doctor": {
        rules: {
          "no-pass-data-to-parent": { create() { return {}; } },
          "no-event-handler": { create() { return {}; } },
          "nextjs-no-a-element": { create() { return {}; } },
          "no-initialize-state": { create() { return {}; } },
          "nextjs-no-img-element": { create() { return {}; } },
          "js-index-maps": { create() { return {}; } },
        }
      }
    }
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
  }
];

export default eslintConfig;
