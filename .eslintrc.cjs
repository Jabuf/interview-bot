module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
      }
    }
  ],
  rules: {
    'no-console': 'error',
    semi: ['error', 'never']
  },
  root: true
};
