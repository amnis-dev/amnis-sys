import type { DynamicPlugin } from './types.js';

export const plugin: DynamicPlugin = {
  key: '@amnis/state',
  name: 'State',
  description: 'Fundamental state management.',
  author: 'Eric Crowell',
  path: '',
  set: async () => (await import('@amnis/state/set')).set,
  schema: async () => (await import('@amnis/state/schema')).schema,
  locale: async () => (await import('@amnis/state/locale')).locale,
  data: async () => (await import('@amnis/state/data')).data,
  dataTest: async () => (await import('@amnis/state/dataTest')).dataTest,
};

export default plugin;
