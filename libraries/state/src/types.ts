import type { Middleware, Reducer } from '@reduxjs/toolkit';
import type { IoProcessDefinition } from './io/io.types.js';
import type { EntityObjects } from './data/entity/entity.types.js';

interface _SchemaObject {
  id?: string;
  $id?: string;
  $schema?: string;
  [x: string]: any;
}

export interface SchemaObject extends _SchemaObject {
  id?: string;
  $id?: string;
  $schema?: string;
  $async?: false;
  [x: string]: any;
}

export type ReduxSet = {
  reducers: Record<string, Reducer>,
  middleware: Middleware[]
}

export type StateDataPromise = () => Promise<EntityObjects>;

export type ProcessSet = Record<string, IoProcessDefinition>;

export interface DynamicPlugin {
  /**
   * The identifier of the plugin.
   * Usually the name of the package.
   */
  readonly id: string,

  /**
   * A record of reducers and middleware to be added to a redux store.
   */
  set?: () => Promise<ReduxSet>,

  /**
   * Initial data records to be added to the redux store and database.
   */
  data?: () => Promise<StateDataPromise>,

  /**
   * Initial data records to be added to the redux store and database for testing.
   */
  dataTest?: () => Promise<StateDataPromise>;

  /**
   * An array of schema objects that define the data records.
   */
  schema?: () => Promise<SchemaObject[]>,

  /**
   * Process routes for API services.
   */
  process?: () => Promise<ProcessSet>,
}

export interface Plugin {
  /**
   * The identifier of the plugin.
   * Usually the name of the package.
   */
  readonly id: string;

  /**
   * A record of reducers and middleware to be added to a redux store.
   */
  set?: ReduxSet;

  /**
   * Initial data records to be added to the redux store and database.
   */
  data?: StateDataPromise;

  /**
   * Initial data records to be added to the redux store and database for testing.
   */
  dataTest?: StateDataPromise;

  /**
   * An array of schema objects that define the data records.
   */
  schema?: SchemaObject[];

  /**
   * Process routes for API services.
   */
  process?: ProcessSet;
}
