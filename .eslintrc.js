module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest/globals": true,
    },
    "extends": [
        "airbnb-base",
        "plugin:react/recommended",
    ],
    "rules": {
        // Indent with 4 spaces
        "indent": ["error", 4],

        // Indent JSX with 4 spaces
        "react/jsx-indent": ["error", 4],

        // Indent props with 4 spaces
        "react/jsx-indent-props": ["error", 4],
        "no-nested-ternary": "off",
        "no-use-before-define": "off",
        "react/no-find-dom-node": "off",
        "no-debugger": "off"
    },
    "plugins": ["react", "flowtype", "eslint-plugin-jest", "jest"]
};