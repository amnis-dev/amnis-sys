/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UID } from '../../core/core.types.js';
import type { EntityObjects } from '../../data/entity/entity.types.js';
import type { DataDeleter, DataQuery, DataUpdater } from '../../data/data.types.js';
import type {
  StateScope,
} from '../../state.types.js';

export interface DatabaseControls {
  scope?: StateScope;
  subject?: UID;
}

export type DatabaseCreateMethod = (
  state: EntityObjects,
  controls?: DatabaseControls
) => Promise<EntityObjects>;

export type DatabaseReadMethod = (
  select: DataQuery,
  controls?: DatabaseControls
) => Promise<EntityObjects>;

export type DatabaseUpdateMethod = (
  state: DataUpdater,
  controls?: DatabaseControls
) => Promise<EntityObjects>;

export type DatabaseDeleteMethod = (
  references: DataDeleter,
  controls?: DatabaseControls
) => Promise<DataDeleter>;

/**
 * Core interface for database methods.
 */
export interface Database {
  /**
   * Method to implement database initialization.
   */
  initialize: (...params: any[]) => Promise<void>;

  /**
   * Method for creating new records in the database.
   */
  create: DatabaseCreateMethod;

  /**
   * Selects data from the database determined by the select query.
   */
  read: DatabaseReadMethod;

  /**
   * Method for updating records in the database.
   */
  update: DatabaseUpdateMethod;

  /**
   * Method to delete records in the database.
   * Shouldn't actually delete records, but mark them as deleted instead.
   */
  delete: DatabaseDeleteMethod;
}
