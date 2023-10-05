import { pluginCreate, pluginSlice } from './plugin.js';

/**
 * ============================================================
 */
test('plugin key should be is properly set', () => {
  expect(pluginSlice.key).toEqual('plugin');
});

/**
 * ============================================================
 */
test('should create a plugin', () => {
  const plugin = pluginCreate({
    key: '@plugin/test',
    name: 'Test Plugin',
  });

  expect(plugin).toEqual(
    expect.objectContaining({
      key: '@plugin/test',
      name: 'Test Plugin',
    }),
  );
});
