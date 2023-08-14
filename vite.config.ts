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
        react: resolve(__dirname, 'src/react/index.ts'),
      },
      name: 'AmnisSystem',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        '@amnis/state',
        '@amnis/state/set',
        '@amnis/state/context',
        '@amnis/state/plugin',
        '@amnis/mock',
        '@amnis/api',
        '@amnis/api/set',
        '@amnis/api/process',
        '@amnis/api/plugin',
        '@amnis/web',
        '@amnis/web/set',
        '@amnis/web/plugin',
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
