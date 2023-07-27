import type { SchemaObject } from 'ajv';
import type {
  Entity, EntityObjects, System,
} from '../data/index.js';
import {
  dataInitial,
  dataActions,
  systemSlice,
  roleSlice,
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

export interface ContextOptions extends Omit<Partial<IoContext>, 'schemas' | 'validators'> {

  /**
   * Schemas can be added by array.
   */
  schemas?: SchemaObject[];

  /**
   * Set initial entity data.
   */
  data?: EntityObjects;

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
    data = await dataInitial(),
    emailer = emailerMemory(),
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
    dataResult = await database.create(data);
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
