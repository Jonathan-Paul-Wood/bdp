const noUnsanitized = require("eslint-plugin-no-unsanitized");

const extensionGlobals = {
  browser: "readonly",
  console: "readonly",
  document: "readonly",
  globalThis: "readonly",
  URL: "readonly"
};

const nodeGlobals = {
  __dirname: "readonly",
  console: "readonly",
  process: "readonly",
  require: "readonly"
};

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "web-ext-artifacts/**"
    ]
  },
  {
    files: [
      "background.js",
      "content-script.js",
      "panel/**/*.js"
    ],
    plugins: {
      "no-unsanitized": noUnsanitized
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: extensionGlobals
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error"
    }
  },
  {
    files: [
      "eslint.config.cjs",
      "scripts/**/*.cjs"
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: nodeGlobals
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    }
  }
];
