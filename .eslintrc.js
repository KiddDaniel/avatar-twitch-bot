module.exports = {
    root: true,
    extends: ["airbnb-typescript/base"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["./tsconfig.eslint.json"],
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            typescript: {},
        },
    },
    rules: {
        "max-len": ["error", 120, 4],
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            },
        ],
        camelcase: [
            "error",
            {
                properties: "always",
                ignoreDestructuring: false,
                ignoreImports: false,
                ignoreGlobals: false,
            },
        ],
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
        "class-methods-use-this": "off",
        "import/prefer-default-export": "off",
        "no-param-reassign": "off",
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "operator-linebreak": "off",
        "object-curly-newline": [
            "error",
            {
                ObjectExpression: { consistent: true },
                ObjectPattern: { consistent: true },
                ImportDeclaration: { consistent: true },
                ExportDeclaration: { consistent: true },
            },
        ],
        "implicit-arrow-linebreak": "off",
        "function-paren-newline": "off",
        "prefer-template": "off",
        "no-underscore-dangle": "off",
        "no-plusplus": "off",
        "@typescript-eslint/quotes": ["error", "double", { allowTemplateLiterals: true }],
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/lines-between-class-members": "off",
        "no-bitwise": "off",
    },
    overrides: [
        {
            files: ["test/**/*.?(e2e-)spec.{j,t}s?(x)"],
            env: {
                jest: true,
            },
        },
    ],
    ignorePatterns: ["dist/*", "node_modules/*"],
    env: {
        jest: true,
    },
};
