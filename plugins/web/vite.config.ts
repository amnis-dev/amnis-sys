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
        locale: resolve(__dirname, 'src/locale/index.ts'),
        data: resolve(__dirname, 'src/data/index.ts'),
        dataTest: resolve(__dirname, 'src/data/test/index.ts'),
        react: resolve(__dirname, 'src/react/index.ts'),
        reactHooks: resolve(__dirname, 'src/react/hooks/index.ts'),
        reactContext: resolve(__dirname, 'src/react/context/index.ts'),
        reactMaterial: resolve(__dirname, 'src/react/material/index.ts'),
        ui: resolve(__dirname, 'src/ui/index.ts'),
        manager: resolve(__dirname, 'src/manager/index.ts'),
        managerLocale_en: resolve(__dirname, 'src/manager/locale/en/index.ts'),
        managerLocale_de: resolve(__dirname, 'src/manager/locale/de/index.ts'),

        libReactRouterDom: resolve(__dirname, 'src/lib/react-router-dom/index.ts'),
      },
      name: 'AmnisWeb',
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
        /^@mui\/.*/,
        /^@emotion\/.*/,
        'react',
        'react-dom',
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
