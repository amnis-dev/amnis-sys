import {
  type StaticPlugin, type DynamicPlugin, pluginCreate,
} from '@amnis/state';

type ImporterPropOptions = (keyof Omit<DynamicPlugin, 'id'>)[];

type PluginModulePossibilities =
  { key: StaticPlugin['key'] } |
  { set: StaticPlugin['set'] } |
  { data: StaticPlugin['data'] } |
  { dataTest: StaticPlugin['dataTest'] } |
  { schema: StaticPlugin['schema'] } |
  { process: StaticPlugin['process'] } |
  undefined;

/**
 * Default importer properties.
 */
const defaultImporterProps: ImporterPropOptions = [
  'set', 'data', 'schema', 'locale', 'process', 'data', 'dataTest',
];

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
  props: ImporterPropOptions = defaultImporterProps,
): Promise<StaticPlugin> {
  const modules = Array.from(new Set(props));
  let pluginResolved: StaticPlugin = pluginCreate({
    key: plugin.key,
    name: plugin.name,
    author: plugin.author,
    description: plugin.description,
  });
  const modulesFiltered = modules.filter((module) => !!plugin[module]);

  const importedResults = await Promise.all(
    modulesFiltered.map<Promise<PluginModulePossibilities>>(async (module) => {
      const dynamicImport = plugin[module];
      if (!dynamicImport) {
        return undefined;
      }

      if (!(dynamicImport instanceof Function)) {
        return { [module]: dynamicImport } as PluginModulePossibilities;
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
  props: ImporterPropOptions = defaultImporterProps,
): Promise<StaticPlugin[]> {
  const modules = Array.from(new Set(props));

  const imports = await Promise.all(
    plugins.map<Promise<StaticPlugin>>(async (plugin) => importerPlugin(plugin, modules)),
  );

  return imports;
}
