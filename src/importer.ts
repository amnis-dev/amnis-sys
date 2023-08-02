import type {
  Plugin, DynamicPlugin,
} from '@amnis/state';

type ImporterPropOptions = (keyof Omit<DynamicPlugin, 'id'>)[];

type PluginModulePossibilities =
  {set: Plugin['set']} |
  {data: Plugin['data']} |
  {dataTest: Plugin['dataTest']} |
  {schema: Plugin['schema']} |
  {process: Plugin['process']} |
  undefined;

/**
 * Import a single dynamic plugin.
 */
export async function importerPlugin(
  /**
   * Dynamic plugin to import.
   */
  plugin: DynamicPlugin,

  /**
   * Individual modules to import.
   */
  props: ImporterPropOptions = ['set', 'data', 'schema', 'process', 'data', 'dataTest'],
): Promise<Plugin> {
  const modules = Array.from(new Set(props));
  let pluginResolved: Plugin = {
    id: plugin.id,
  };
  const modulesFiltered = modules.filter((module) => !!plugin[module]);

  const importedResults = await Promise.all(
    modulesFiltered.map<Promise<PluginModulePossibilities>>(async (module) => {
      const dynamicImport = plugin[module];
      if (!dynamicImport) {
        return undefined;
      }

      const imported = await dynamicImport();
      return { [module]: imported } as PluginModulePossibilities;
    }),
  );

  importedResults.forEach((importedResult) => {
    if (!importedResult) {
      return;
    }

    pluginResolved = {
      ...pluginResolved,
      ...importedResult,
    };
  });

  return pluginResolved;
}

/**
 * Imports plugin modules from a DynamicPlugin type.
 */
export async function importerPlugins(
  /**
   * Dynamic plugins to import.
   */
  plugins: DynamicPlugin[],

  /**
   * Individual modules to import.
   */
  props: ImporterPropOptions = ['set', 'data', 'schema', 'process', 'data', 'dataTest'],
): Promise<Plugin[]> {
  const modules = Array.from(new Set(props));

  const imports = await Promise.all(
    plugins.map<Promise<Plugin>>(async (plugin) => importerPlugin(plugin, modules)),
  );

  return imports;
}
