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
        records: resolve(__dirname, 'src/records/index.ts'),
        schema: resolve(__dirname, 'src/schema/index.ts'),
        context: resolve(__dirname, 'src/context/index.ts'),
        set: resolve(__dirname, 'src/set/index.ts'),
        data: resolve(__dirname, 'src/records/index.ts'),
        dataTest: resolve(__dirname, 'src/data/data.default.ts'),
      },
      name: 'AmnisState',
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
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 20000,
  },
});
