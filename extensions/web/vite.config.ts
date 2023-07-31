/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'modules',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        set: resolve(__dirname, 'src/set/index.ts'),
        react: resolve(__dirname, 'src/react/index.ts'),
      },
      name: 'AmnisWeb',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        '@amnis/state',
        '@amnis/mock',
        '@amnis/api',
        '@blueprintjs/core',
        'react',
        'react-dom',
        'node:crypto',
        'crypto',
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 10000,
    setupFiles: './test.setup.js',
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
