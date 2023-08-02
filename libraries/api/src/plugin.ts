import type { DynamicPlugin } from '@amnis/state';

export const plugin: DynamicPlugin = {
  id: '@amnis/api',
  set: async () => (await import('@amnis/api/set')).set,
  schema: async () => (await import('@amnis/api/schema')).schema,
  process: async () => (await import('@amnis/api/process')).process,
};

export default plugin;
