/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        msw: resolve(__dirname, 'src/msw/index.ts'),
        mswNode: resolve(__dirname, 'src/msw/node/index.ts'),
        worker: resolve(__dirname, 'src/worker/index.ts'),
      },
      name: 'AmnisMock',
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
        /^@amnis\/mock(\/?.*)/,
        /^msw(\/?.*)/,
        /^node:.*/,
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 100000,
    hookTimeout: 100000,
  },
});
