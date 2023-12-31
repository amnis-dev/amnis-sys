import type { SchemaObject } from '@amnis/state/ajv';
import type {
  Entity, EntityObjects, System, Plugin,
} from '../data/index.js';
import {
  dataTest,
  dataActions,
  systemSlice,
  roleSlice,
  schemaSlice,
  localeSlice,
  localeDocumentToEntities,
  pluginPurify,
  pluginSlice,
} from '../data/index.js';
import type {
  IoContext,
} from '../io/index.js';
import {
  cryptoWeb,
  databaseMemory,
  filesystemMemory,
  emailerMemory,
} from '../io/index.js';
import { storeSetup } from '../store.js';
import { validateSetup } from './validate.js';
import { dataMinimal } from '../data.minimal.js';
import type {
  DynamicPlugin, StateDataPromise, StateLocale, StaticPlugin,
} from '../types.js';
import { stateEntitiesCreate } from '../state.js';
import { historyMake, historySlice } from '../data/entity/history/index.js';
import { GrantTask } from '../data/grant/index.js';

export interface ContextOptions extends Omit<Partial<IoContext>, 'schemas' | 'validators'> {

  /**
   * Schemas can be added by array.
   */
  schemas?: SchemaObject[];

  /**
   * Set initial entity data.
   */
  data?: StateDataPromise;

  /**
   * Locale to use for the initial system.
   */
  locale?: StateLocale;

  /**
   * Plugin types.
   */
  plugins?: (DynamicPlugin | StaticPlugin | Plugin)[];

  /**
   * System handle to use for the initial system.
   */
  systemHandle?: string;
}

/**
 * Initializes a service context with optional parameters.
 */
export async function contextSetup(options: ContextOptions = {}): Promise<IoContext> {
  const {
    store = storeSetup(),
    schemas = [],
    database = databaseMemory,
    filesystem = filesystemMemory,
    crypto = cryptoWeb,
    data = dataTest,
    emailer = emailerMemory(),
    locale = (await import('@amnis/state/locale')).locale,
    plugins = [],
    systemHandle,
  } = options;

  /**
   * Clean the store.
   */
  store.dispatch(dataActions.wipe());

  let dataResult = await database.read({
    [systemSlice.key]: {},
    [roleSlice.key]: {},
  });

  const systems = dataResult[systemSlice.key] as Entity<System>[];
  let system = systemHandle ? systems?.find((s) => s.handle === systemHandle) : systems?.[0];

  /**
   * Initialize the system if one isn't found.
   */
  if (!systems || systems?.length === 0) {
    const dataInitial = await data(dataMinimal());

    /**
     * Insert the locale into the initial data.
     */
    dataInitial[localeSlice.key] = dataInitial[localeSlice.key] ?? [];
    dataInitial[localeSlice.key].push(...Object.keys(locale).map((key) => (
      localeDocumentToEntities(key, locale[key])
    )).flat());

    /**
     * Insert plugin data.
     */
    if (plugins.length > 0) {
      const pluginEntities = plugins.map(
        (plugin) => pluginSlice.createEntity(pluginPurify(plugin)),
      );
      dataInitial[pluginSlice.key] = pluginEntities;
    }

    /**
     * Cache locale from the initial data.
     */
    Object.values(dataInitial).flat().forEach((entity) => {
      const localeNames: string[] = [];
      Object.values(entity).forEach((value) => {
        if (typeof value === 'string' && value.charAt(0) === '%') {
          const name = value.slice(1);
          if (name.length > 0) {
            localeNames.push(name);
          }
        }
      });
      entity.locale = localeNames;
    });

    const dataWithHistory = stateEntitiesCreate({
      ...dataInitial,
      [historySlice.key]: historyMake(dataInitial, GrantTask.Create),
    }, { committed: true, new: false });
    dataResult = await database.create(dataWithHistory);
    system = dataResult[systemSlice.key]?.[0] as Entity<System>;
  }

  if (!system) {
    if (systemHandle) {
      throw new Error(`Failed to read system with handle '${systemHandle}'.`);
    }
    throw new Error('Failed to read system.');
  }

  const serviceResult: EntityObjects = {
    [systemSlice.key]: dataResult[systemSlice.key],
    [roleSlice.key]: dataResult[roleSlice.key],
  };
  store.dispatch(dataActions.create(serviceResult));
  store.dispatch(systemSlice.action.activeSet(system.$id));

  const schemaObjects = schemas.reduce<SchemaObject>(
    (acc, schema) => {
      if (!schema?.$id) {
        throw new Error('Schema must have an $id property.');
      }
      const { $id } = schema;
      acc[$id] = schema;

      /**
       * Populate the schema state.
       */
      store.dispatch(schemaSlice.action.populate(schema));

      return acc;
    },
    {},
  );

  const validators = schemas ? validateSetup(schemas) : {};

  return {
    store,
    schemas: schemaObjects,
    validators,
    database,
    filesystem,
    crypto,
    emailer,
  };
}

export default contextSetup;
