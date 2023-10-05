import pluginState from '@amnis/state/plugin';
import pluginApi from '@amnis/api/plugin';
import pluginWeb from '@amnis/web/plugin';
import { pluginMerge } from './plugin.js';
import { importerPlugins } from './importer.js';

/**
 * Merge all plugins into a single plugin.
 */
test('should merge plugins', async () => {
  const plugins = await importerPlugins([
    pluginState,
    pluginApi,
    pluginWeb,
  ]);

  const plugin = pluginMerge(plugins);

  expect(plugin).toBeDefined();
  expect(plugin.key).toBe('@plugin/merged');
  expect(plugin.locale).toBeDefined();
});
