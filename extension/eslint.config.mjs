import js from "@eslint/js"
import prettierConfig from "eslint-config-prettier"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
    {
        // Generated and vendored output.
        ignores: ["build/**", ".plasmo/**", "node_modules/**"]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },
            globals: {
                ...globals.browser,
                // Plasmo inlines `process.env.PLASMO_PUBLIC_*` at build time.
                process: "readonly",
                chrome: "readonly"
            }
        },
        settings: {
            react: { version: "detect" }
        },
        plugins: {
            react,
            "react-hooks": reactHooks
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            // The extension uses the automatic JSX runtime.
            ...react.configs.flat["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,
            // Enforce the `import type` style the codebase already uses, which
            // `verbatimModuleSyntax` requires for type-only imports.
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { prefer: "type-imports", fixStyle: "separate-type-imports" }
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
            ]
        }
    },
    {
        // Tailwind's config is CommonJS: package.json declares no module type.
        files: ["*.config.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: globals.node
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off"
        }
    },
    // Must come last so formatting rules defer to Prettier.
    prettierConfig
)
