/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        plugin: resolve(__dirname, 'src/plugin.ts'),
        react: resolve(__dirname, 'src/query/react.ts'),
        mw: resolve(__dirname, 'src/mw/index.ts'),
        utility: resolve(__dirname, 'src/utility/index.ts'),
        process: resolve(__dirname, 'src/process/index.ts'),
        schema: resolve(__dirname, 'src/schema/index.ts'),
        set: resolve(__dirname, 'src/set/index.ts'),
      },
      name: 'AmnisApi',
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
        /^node:.*/,
        'react',
        'react-dom',
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 100000,
    hookTimeout: 100000,
  },
});
