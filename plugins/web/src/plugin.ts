import type { DynamicPlugin } from '@amnis/state';

export const plugin: DynamicPlugin = {
  id: '@amnis/web',
  set: async () => (await import('@amnis/web/set')).set,
  schema: async () => (await import('@amnis/web/schema')).schema,
  data: async () => (await import('@amnis/web/data')).data,
  dataTest: async () => (await import('@amnis/web/data/test')).dataTest,
};

export default plugin;
