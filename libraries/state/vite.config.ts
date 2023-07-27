/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        records: resolve(__dirname, 'src/records/index.ts'),
        schema: resolve(__dirname, 'src/schema/index.ts'),
        context: resolve(__dirname, 'src/context/index.ts'),
      },
      name: 'AmnisState',
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          '@reduxjs/toolkit': 'ReduxToolkit',
        },
      },
      external: [
        '@reduxjs/toolkit',
        'node:crypto',
        'crypto',
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 10000,
  },
});
