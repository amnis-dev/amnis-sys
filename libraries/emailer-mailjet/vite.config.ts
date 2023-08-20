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
      name: 'AmnisDbCosmos',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        /^@amnis\/state(\/?.*)/,
        /^@amnis\/mock(\/?.*)/,
        /^@amnis\/api(\/?.*)/,
        /^@amnis\/web(\/?.*)/,
        /^node:.*/,
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 100000,
    hookTimeout: 100000,
    setupFiles: ['./vitest.setup.ts'],
    singleThread: true,
    sequence: {
      setupFiles: 'list',
    },
  },
});
