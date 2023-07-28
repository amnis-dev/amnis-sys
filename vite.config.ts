/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      name: 'AmnisSystem',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        '@amnis/state',
        '@amnis/mock',
        '@amnis/api',
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
