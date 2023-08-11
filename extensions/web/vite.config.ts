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
        plugin: resolve(__dirname, 'src/plugin.ts'),
        set: resolve(__dirname, 'src/set/index.ts'),
        schema: resolve(__dirname, 'src/schema/index.ts'),
        data: resolve(__dirname, 'src/data/index.ts'),
        react: resolve(__dirname, 'src/react/index.ts'),
        crystalizer: resolve(__dirname, 'src/crystalizer/index.ts'),
      },
      name: 'AmnisWeb',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        '@amnis/web/set',
        '@amnis/web/schema',
        '@amnis/web/data',
        '@amnis/web/dataTest',
        '@amnis/web/crystalizer',
        '@amnis/state',
        '@amnis/mock',
        '@amnis/api',
        '@blueprintjs/core',
        '@mui/material',
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
