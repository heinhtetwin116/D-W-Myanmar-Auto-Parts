import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import checkFile from "eslint-plugin-check-file";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: { "check-file": checkFile },
    files: ["app/**/*", "components/**/*", "lib/**/*"],
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
      // Scoped to components/ and lib/ only: Next.js requires exact
      // folder names under app/ (e.g. [locale], [slug], (group)), so
      // app/ folders are intentionally not checked. Next.js reserved
      // filenames (page.tsx, layout.tsx, route.ts, ...) are already
      // valid KEBAB_CASE and need no exception.
      "check-file/folder-naming-convention": [
        "error",
        {
          "components/**/": "KEBAB_CASE",
          "lib/**/": "KEBAB_CASE",
        },
      ],
    },
  },
];

export default eslintConfig;
