import type {
  Plugin,
  ReduxSet,
  StateDataPromise,
  SchemaObject,
  ProcessSet,
  StateDataGuaranteed,
} from '@amnis/state';

/**
 * Merge an array of sets from a plugin.
 */
export function pluginSetsMerge(
  /**
   * Plugins to merge.
   */
  plugins: Plugin[],
): Plugin['set'] {
  const sets = plugins.map((plugin) => plugin.set).filter((set): set is ReduxSet => !!set);

  if (sets.length === 0) {
    return undefined;
  }

  const setsMerged = sets.reduce<ReduxSet>(
    (acc, set) => {
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
  plugins: Plugin[],
): Plugin['data'] {
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
 * Merge schema from an array of plugins.
 */
export function pluginSchemaMerge(
  /**
   * Plugins to merge.
   */
  plugins: Plugin[],
): Plugin['schema'] {
  const schema = plugins
    .map((plugin) => plugin.schema)
    .filter((schema): schema is SchemaObject[] => !!schema);

  if (schema.length === 0) {
    return undefined;
  }

  const schemaMerged = schema.flat();

  return schemaMerged;
}

/**
 * Merge process from an array of plugins.
 */
export function pluginProcessMerge(
  /**
   * Plugins to merge.
   */
  plugins: Plugin[],
): Plugin['process'] {
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
 * Merges an array of plugins into a single plugin.
 */
export function pluginMerge(
  /**
   * Plugins to merge.
   */
  plugins: Plugin[],
): Plugin {
  const pluginMerged: Plugin = {
    id: 'merged',
  };

  /** Merge sets */
  pluginMerged.set = pluginSetsMerge(plugins);

  /** Merge data */
  pluginMerged.data = pluginDataMerge(plugins);

  /** Merge dataTest */
  pluginMerged.dataTest = pluginDataMerge(plugins);

  /** Merge schema */
  pluginMerged.schema = pluginSchemaMerge(plugins);

  /** Merge process */
  pluginMerged.process = pluginProcessMerge(plugins);

  return pluginMerged;
}

export default pluginMerge;
