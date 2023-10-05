import { type DynamicPlugin } from '@amnis/state';

export const plugin: DynamicPlugin = {
  key: '@amnis/web',
  name: 'Web',
  description: 'Essentials for web data and rendering.',
  author: 'Eric Crowell',
  path: '',
  set: async () => (await import('@amnis/web/set')).set,
  schema: async () => (await import('@amnis/web/schema')).schema,
  locale: async () => (await import('@amnis/web/locale')).locale,
  data: async () => (await import('@amnis/web/data')).data,
  dataTest: async () => (await import('@amnis/web/data/test')).dataTest,
};

export default plugin;
