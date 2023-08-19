/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AmnisMock',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        /^@amnis\/state(\/.*)/,
        /^@amnis\/mock(\/.*)/,
        /^@amnis\/api(\/.*)/,
        /^@amnis\/web(\/.*)/,
        /^msw(\/.*)/,
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
