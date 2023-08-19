/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AmnisExpress',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^@amnis\/state(\/.*)/,
        /^@amnis\/mock(\/.*)/,
        /^@amnis\/api(\/.*)/,
        /^@amnis\/web(\/.*)/,
        /^node:.*/,
        'crypto',
        'express',
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 100000,
    hookTimeout: 100000,
  },
});
