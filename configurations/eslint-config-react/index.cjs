module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:require-extensions/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    tsconfigRootDir: './',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'no-shadow': 'off',
    'no-bitwise': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: 0,
    'no-param-reassign': ['error', { props: false }],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'import/no-extraneous-dependencies': [0, {
      devDependencies: ['**/*.test.js', '**/*.stories.js'],
    }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': [1, {
      html: 'enforce',
      custom: 'ignore',
      explicitSpread: 'enforce',
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
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
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: [
        '**/*.stories.js',
        '**/*.stories.jsx',
        '**/*.stories.ts',
        '**/*.stories.tsx',
      ],
      rules: {
        'react/function-component-definition': 0,
      },
    },
    {
      files: [
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
