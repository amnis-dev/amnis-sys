import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from 'vite';
import { resolve } from 'node:path';

const config: StorybookConfig = {
  stories: [
    "../plugins/web/src/**/*.mdx",
    "../plugins/web/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ['../public'],
  managerHead: (head) => `
    ${head}
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#65297d">
    <meta name="theme-color" content="#65297d">
  `,
  viteFinal: (config) => {
    return mergeConfig(config, {
      assetsInclude: ['/sb-preview/runtime.js'],
      build: {
        rollupOptions: {
          external: [
            'node:crypto',
            'crypto',
            'timers',
            'http',
            'https',
            'stream',
            'zlib',
          ],
        }
      },
      resolve: {
        alias: [
          // {
          //   find: /^@amnis\/state(\/.*)/,
          //   replacement: resolve("libraries/state/src$1"),
          // },
          // {
          //   find: /^@amnis\/mock(\/.*)/,
          //   replacement: resolve("libraries/mock/src$1"),
          // },
          // {
          //   find: /^@amnis\/api(\/.*)/,
          //   replacement: resolve("libraries/api/src$1"),
          // },
          {
            find: /^@\/storybook(\/?.*)/,
            replacement: resolve(".storybook$1"),
          },
          {
            find: /^@amnis\/express(\/?.*)/,
            replacement: resolve("libraries/express/src$1"),
          },
          {
            find: /^@amnis\/db-cosmos(\/?.*)/,
            replacement: resolve("libraries/db-cosmos/src$1"),
          },
          {
            find: /^@amnis\/db-cosmos(\/?.*)/,
            replacement: resolve("libraries/emailer-mailjet/src$1"),
          },
          {
            find: /^@amnis\/web(\/?.*)/,
            replacement: resolve("plugins/web/src$1"),
          },
          {
            find: /^@amnis\/sys(\/?.*)/,
            replacement: resolve("src$1"),
          },
        ]
      }
    });
  },
};
export default config;
