import {
  type StaticPlugin,
  type ReduxSet,
  type StateDataPromise,
  type SchemaObject,
  type ProcessSet,
  type StateDataGuaranteed,
  type UserInterface,
  type StateLocale,
  pluginCreate,
} from '@amnis/state';

/**
 * Merge an array of sets from a plugin.
 */
export function pluginSetsMerge(
  /**
   * Plugins to merge.
   */
  plugins: StaticPlugin[],
): StaticPlugin['set'] {
  const sets = plugins.map((plugin) => plugin.set).filter((set): set is ReduxSet => !!set);

  if (sets.length === 0) {
    return undefined;
  }

  const setsMerged = sets.reduce<ReduxSet>(
    (acc, set) => {
      acc.slices = {
        ...acc.slices,
        ...set.slices,
      };

      acc.reducers = {
        ...acc.reducers,
        ...set.reducers,
      };

      acc.middleware = [
        ...acc.middleware,
        ...set.middleware,
      ];
      return acc;
    },
    {
      slices: {},
      reducers: {},
      middleware: [],
    },
  );

  return setsMerged;
}

/**
 * Merge data from an array of plugins.
 */
export function pluginDataMerge(
  /**
   * Plugins to merge.
   */
  plugins: StaticPlugin[],
): StaticPlugin['data'] {
  const data = plugins
    .map((plugin) => plugin.data)
    .filter((data): data is StateDataPromise => !!data);

  if (data.length === 0) {
    return undefined;
  }

  const dataMerged: StateDataPromise = async (dataGuaranteed) => data.reduce(async (acc, data) => {
    const nextData = await acc;
    return data(nextData) as Promise<StateDataGuaranteed>;
  }, Promise.resolve(dataGuaranteed));

  return dataMerged;
}

/**
 * Merge test data from an array of plugins.
 */
export function pluginDataTestMerge(
  /**
   * Plugins to merge.
   */
  plugins: StaticPlugin[],
): StaticPlugin['dataTest'] {
  const data = plugins
    .map((plugin) => plugin.dataTest)
    .filter((data): data is StateDataPromise => !!data);

  if (data.length === 0) {
    return undefined;
  }

  const dataMerged: StateDataPromise = async (dataGuaranteed) => data.reduce(async (acc, data) => {
    const nextData = await acc;
    return data(nextData) as Promise<StateDataGuaranteed>;
  }, Promise.resolve(dataGuaranteed));

  return dataMerged;
}

/**
 * Merge schema from an array of plugins.
 */
export function pluginSchemaMerge(
  /**
   * Plugins to merge.
   */
  plugins: StaticPlugin[],
): StaticPlugin['schema'] {
  const schema = plugins
    .map((plugin) => plugin.schema)
    .filter((schema): schema is SchemaObject[] => !!schema);

  if (schema.length === 0) {
    return undefined;
  }

  const schemaMerged = schema.flat();

  // Schema definitions to combine if they have the same id.
  const combineDefinitions = [
    'DataCreator',
    'DataUpdater',
  ];

  /**
   * Combine schemas with the same id.
   */
  const schemaMergedCombined = schemaMerged.reduce<Record<string, SchemaObject>>((acc, schema) => {
    const schemaId = schema.$id;
    if (!schema || !schemaId || !schema.definitions) {
      return acc;
    }

    if (acc[schemaId]) {
      // Combine schema definitions.
      acc[schemaId].definitions = {
        ...schema.definitions,
        ...acc[schemaId].definitions,
      };

      // Special case: combine definition properties.
      combineDefinitions.forEach((definition) => {
        if (
          acc[schemaId].definitions?.[definition]?.properties
          && schema.definitions?.[definition]?.properties
        ) {
          acc[schemaId].definitions[definition].properties = {
            ...schema.definitions[definition].properties,
            ...acc[schemaId].definitions[definition].properties,
          };
        }
      });

      return acc;
    }

    acc[schemaId] = schema;
    return acc;
  }, {});

  return Object.values(schemaMergedCombined);
}

/**
 * Merge process from an array of plugins.
 */
export function pluginProcessMerge(
  /**
   * Plugins to merge.
   */
  plugins: StaticPlugin[],
): StaticPlugin['process'] {
  const process = plugins
    .map((plugin) => plugin.process)
    .filter((process): process is ProcessSet => !!process);

  if (process.length === 0) {
    return undefined;
  }

  const processMerged = process.reduce<ProcessSet>(
    (acc, process) => ({
      ...acc,
      ...process,
    }),
    {},
  );

  return processMerged;
}

/**
 * Merges locale records from an array of plugins.
 */
export function pluginLocaleMerge(
  plugins: StaticPlugin[],
): StaticPlugin['locale'] {
  const locales = plugins
    .map((plugin) => plugin.locale)
    .filter((locale): locale is StateLocale => !!locale);

  if (locales.length === 0) {
    return undefined;
  }

  const localesMerged = locales.reduce<StateLocale>(
    (acc, locale) => {
      // Merge each locale record (each language code).
      Object.keys(locale).forEach((key) => {
        if (!acc[key]) {
          acc[key] = {};
        }

        acc[key] = {
          ...acc[key],
          ...locale[key],
        };
      });

      return acc;
    },
    {},
  );

  return localesMerged;
}

/**
 * Merges UI records from an array of plugins.
 */
export function pluginUIMerge(
  plugins: StaticPlugin[],
): StaticPlugin['ui'] {
  const uis = plugins.map((plugin) => plugin.ui).filter((ui): ui is UserInterface => !!ui);

  if (uis.length === 0) {
    return undefined;
  }

  const uisMerged = uis.reduce<UserInterface>(
    (acc, ui) => ({
      ...acc,
      ...ui,
    }),
    {},
  );

  return uisMerged;
}

/**
 * Merges an array of plugins into a single plugin.
 */
export function pluginMerge(
  /**
   * Plugins to merge.
   */
  plugins: StaticPlugin[],
): StaticPlugin {
  const pluginMerged: StaticPlugin = pluginCreate({
    key: '@plugin/merged',
    name: 'Merged',
  });

  /** Merge sets */
  pluginMerged.set = pluginSetsMerge(plugins);

  /** Merge data */
  pluginMerged.data = pluginDataMerge(plugins);

  /** Merge dataTest */
  pluginMerged.dataTest = pluginDataTestMerge(plugins);

  /** Merge schema */
  pluginMerged.schema = pluginSchemaMerge(plugins);

  /** Merge locale */
  pluginMerged.locale = pluginLocaleMerge(plugins);

  /** Merge process */
  pluginMerged.process = pluginProcessMerge(plugins);

  /** Merge UI */
  pluginMerged.ui = pluginUIMerge(plugins);

  return pluginMerged;
}

export default pluginMerge;
