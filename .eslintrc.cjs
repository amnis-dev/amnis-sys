module.exports = {
  extends: ['@amnis/eslint-config-node'],
  overrides: [
    {
      files: ['websites/documentation/**/*'],
      rules: {
        'import/extensions': 'off',
        'global-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
