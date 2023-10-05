import pluginState from '@amnis/state/plugin';
import pluginApi from '@amnis/api/plugin';
import { importerPlugin, importerPlugins } from './importer.js';

/**
 * Test the importerPlugin function with a single plugin.
 */
test('importerPlugins with a single plugin', async () => {
  const statePluginImported = await importerPlugin(pluginState);

  expect(statePluginImported.key).toBe(pluginState.key);

  expect(statePluginImported).toEqual({
    $id: expect.any(String),
    name: 'State',
    author: 'Eric Crowell',
    description: expect.any(String),
    path: expect.any(String),
    key: pluginState.key,
    set: expect.any(Object),
    schema: expect.any(Array),
    locale: expect.any(Object),
    data: expect.any(Function),
    dataTest: expect.any(Function),
  });
});

/**
 * Ensure specific modules can be imported.
 */
test('importerPlugins with a single plugin', async () => {
  const statePluginImported = await importerPlugin(pluginState, ['set']);

  expect(statePluginImported.key).toBe(pluginState.key);

  expect(statePluginImported).toEqual({
    $id: expect.any(String),
    name: 'State',
    author: 'Eric Crowell',
    description: expect.any(String),
    path: expect.any(String),
    key: pluginState.key,
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
  expect(statePluginImported.key).toBe(pluginState.key);

  expect(statePluginImported).toEqual({
    $id: expect.any(String),
    name: 'State',
    author: 'Eric Crowell',
    description: expect.any(String),
    path: expect.any(String),
    key: pluginState.key,
    set: expect.any(Object),
    schema: expect.any(Array),
    locale: expect.any(Object),
    data: expect.any(Function),
    dataTest: expect.any(Function),
  });

  const apiPluginImported = plugins[1];
  expect(apiPluginImported.key).toBe(pluginApi.key);

  expect(apiPluginImported).toEqual({
    $id: expect.any(String),
    name: 'Api',
    author: 'Eric Crowell',
    description: expect.any(String),
    path: expect.any(String),
    key: pluginApi.key,
    set: expect.any(Object),
    schema: expect.any(Array),
    process: expect.any(Object),
  });
});
