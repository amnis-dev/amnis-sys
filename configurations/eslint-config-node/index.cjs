module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:require-extensions/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: 0,
    'no-param-reassign': ['error', { props: false }],
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    '@typescript-eslint/indent': ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'space-before-blocks': ['error', 'always'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    'no-plusplus': 0,
    'import/no-extraneous-dependencies': [0, {
      devDependencies: ['**/*.test.js', '**/*.stories.js'],
    }],
    'import/extensions': [
      'error', 'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/no-cycle': [
      'error',
      {
        maxDepth: 10,
        ignoreExternal: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
