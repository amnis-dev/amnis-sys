/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ActionReducerMapBuilder, EntityState, EntityStateAdapter } from '@reduxjs/toolkit';
import type { UID } from '../core/index.js';

export type Data = { $id: UID };

/**
 * The root of an extended data object.
 */
export type DataRoot<D extends Data> = Omit<D, '$id'>;

/**
 * Minimal amount of information required to create a new extended data object.
 */
export type DataMinimal<
  D extends Data,
  K extends keyof D,
> = Pick<D, K> & Omit<Partial<D>, K>;

/**
 * A collection of complete data objects.
 */
export type DataObjects<D extends Data = Data> = { [key: string]: D[] };

/**
 * An update definition for an extended data object.
 */
export type DataUpdate<D extends Data = Data> = Partial<Omit<D, '$id'>> & { $id: UID };

/**
 * A collection of extended data objects to create.
 */
export type DataCreator<D extends Data = Data & Record<string, any>> = { [key: string]: D[] };

/**
 * A collection of extended data objects to update.
 */
export type DataUpdater<D extends Data = Data & Record<string, any>> = {
  [key: string]: DataUpdate<D>[]
};

/**
 * A collection of extended data objects to delete.
 */
export type DataDeleter = { [key: string]: UID[] };

/**
 * Filter object for a query.
 */
export interface DataFilter {
  /**
   * Matches values that are equal to a specified value.
   */
  $eq?: unknown;

  /**
   * Matches values that do not equal to a specified value.
   */
  $neq?: unknown;

  /**
   * Matches values that are greater than a specified value.
   */
  $gt?: number;

  /**
   * Matches values that are greater than or equal to a specified value.
   */
  $gte?: number;

  /**
   * Matches values that are less than a specified value.
   */
  $lt?: number;

  /**
   * Matches values that are less than or equal to a specified value.
   */
  $lte?: number;

  /**
   * Matches any of the values specified in an array.
   */
  $in?: unknown[];

  /**
   * Matches any of the values specified not in an array.
   */
  $nin?: unknown[];
}

/**
  * StateQuery range
  */
export type DataRange = {
  /**
   * Start query at record value.
   *
   * @minimum 0
   * @maximum 4096
   * @multipleOf 1
   */
  start?: number;

  /**
   * Limit results of the query.
   *
   * @minimum 0
   * @maximum 64
   * @multipleOf 1
   */
  limit?: number;
}

/**
 * Data ordering options.
 */
export type DataOrder = [
  /**
   * The key to order by.
   * @minimum 0
   * @pattern ^[a-zA-Z_$][a-zA-Z_$0-9]+$
   */
  by: string,

  /**
   * The direction to order by.
   * @default 'asc'
   * @enum asc, desc
   */
  direction: 'asc' | 'desc',
];

export type DataQueryProps = {
  [key: string]: DataFilter
};

export type DataQueryOptions = {
  /**
    * Query of keys.
    */
  $query?: DataQueryProps;

  /**
   * Order of query.
   */
  $order?: DataOrder;

  /**
   * Range of query.
   */
  $range?: DataRange;

  /**
   * Request a number of historic records with the results.
   */
  $history?: boolean;

  /**
   * Depth to query for other referenced entities.
   *
   * @minimum 0
   * @maximum 3
   * @multipleOf 1
   */
  $depth?: number;
};

/**
  * A query object to search for data.
  */
export type DataQuery = Record<string, DataQueryOptions>;

/**
 * Meta information for data collections.
 */
export interface DataMeta<D extends Data = Data> {
  /**
   * Type of data collection.
   */
  type: 'data' | 'entity';

  /**
   * The entity id referencing the active entity.
   */
  active: UID | null;

  /**
   * The id representing a focused entity.
   */
  focused: UID | null;

  /**
   * List of ids considered to be selected.
   */
  selection: UID[];

  /**
   * New data that has not been saved to the api.
   */
  new: Record<UID, boolean | undefined>;

  /**
   * Record of original entity data since last updated from the api.
   */
  original: Record<UID, D | undefined>;

  /**
   * Property differences between current and original entities.
   */
  differences: Record<UID, (keyof D)[] | undefined>
}

/**
 * Reducer state for data collections.
 */
export type DataState<D extends Data = Data> = EntityState<D, string> & DataMeta<D>;

export interface DataReducerOptions {
  save: boolean | Record<string, unknown>;
}

export interface DataReducerSettings<
  D extends Data = Data,
  M extends Record<string, any> = object,
  EA extends EntityStateAdapter<D, string> = EntityStateAdapter<D, string>,
  ARMB extends ActionReducerMapBuilder<DataState<D> & M> = ActionReducerMapBuilder<DataState<D> & M>
> {
  key: string;
  adapter: EA;
  builder: ARMB;
  options?: DataReducerOptions;
}

export type DataExtraReducerFunction<
  D extends Data = Data,
  M extends Record<string, any> = object,
> = (
  settings: DataReducerSettings<D, M>
) => void;

export interface DataExtraReducers<
  D extends Data = Data,
  M extends Record<string, any> = object,
> {
  cases: DataExtraReducerFunction<D, M>;
  matchers: DataExtraReducerFunction<D, M>;
}

export type DataExtraReducersApply<D extends Data = Data> = (
  settings: DataReducerSettings<D>,
  reducers: DataExtraReducers<D>[]
) => void;
