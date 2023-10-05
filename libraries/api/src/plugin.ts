import { type DynamicPlugin } from '@amnis/state';

export const plugin: DynamicPlugin = {
  key: '@amnis/api',
  name: 'Api',
  description: 'Fundamental API queries and processing.',
  author: 'Eric Crowell',
  text: [],
  path: '',
  set: async () => (await import('@amnis/api/set')).set,
  schema: async () => (await import('@amnis/api/schema')).schema,
  process: async () => (await import('@amnis/api/process')).process,
};

export default plugin;
