import type { DynamicPlugin } from './types.js';

export const plugin: DynamicPlugin = {
  id: '@amnis/state',
  set: async () => (await import('@amnis/state/set')).set,
  schema: async () => (await import('@amnis/state/schema')).schema,
  data: async () => (await import('@amnis/state/data')).data,
  dataTest: async () => (await import('@amnis/state/dataTest')).dataTest,
};

export default plugin;
