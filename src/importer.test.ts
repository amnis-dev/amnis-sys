import pluginState from '@amnis/state/plugin';
import pluginApi from '@amnis/api/plugin';
import { importerPlugin, importerPlugins } from './importer.js';

/**
 * Test the importerPlugin function with a single plugin.
 */
test('importerPlugins with a single plugin', async () => {
  const statePluginImported = await importerPlugin(pluginState);

  expect(statePluginImported.id).toBe(pluginState.id);

  expect(statePluginImported).toEqual({
    id: pluginState.id,
    set: expect.any(Object),
    schema: expect.any(Array),
    data: expect.any(Function),
    dataTest: expect.any(Function),
  });
});

/**
 * Ensure specific modules can be imported.
 */
test('importerPlugins with a single plugin', async () => {
  const statePluginImported = await importerPlugin(pluginState, ['set']);

  expect(statePluginImported.id).toBe(pluginState.id);

  expect(statePluginImported).toEqual({
    id: pluginState.id,
    set: expect.any(Object),
  });
});

/**
 * Test the importerPlugins function with multiple plugins.
 */
test('importerPlugins with multiple plugins', async () => {
  const plugins = await importerPlugins([pluginState, pluginApi]);

  expect(plugins).toHaveLength(2);

  const statePluginImported = plugins[0];
  expect(statePluginImported.id).toBe(pluginState.id);

  expect(statePluginImported).toEqual({
    id: pluginState.id,
    set: expect.any(Object),
    schema: expect.any(Array),
    data: expect.any(Function),
    dataTest: expect.any(Function),
  });

  const apiPluginImported = plugins[1];
  expect(apiPluginImported.id).toBe(pluginApi.id);

  expect(apiPluginImported).toEqual({
    id: pluginApi.id,
    set: expect.any(Object),
    schema: expect.any(Array),
    process: expect.any(Object),
  });
});
