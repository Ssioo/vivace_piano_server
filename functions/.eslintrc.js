module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-single'],
    'quote-props': ['error', 'as-needed'],
    'max-len': 'off',
    'no-unused-vars': 'off',
    'new-cap': 'off',
  },
}
