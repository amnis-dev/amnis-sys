/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Action, ActionReducerMapBuilder, AnyAction, EntityState, EntityStateAdapter,
} from '@amnis/state/rtk';
import type { UID } from '../core/index.js';

export type Data = { $id: UID };

export interface DataSliceGenericActions {
  insert: (insert: any) => Action & AnyAction,
  insertMany: (inserts: any[]) => Action & AnyAction,
  create: (minimal: any) => Action & AnyAction,
  createMany: (minimals: (any)[]) => Action & AnyAction,
  update: (update: any) => Action & AnyAction,
  updateMany: (updates: any[]) => Action & AnyAction,
  delete: ($id: UID) => Action & AnyAction,
  deleteMany: ($ids: UID[]) => Action & AnyAction,
  activeSet: ($id: UID) => Action & AnyAction,
  activeClear: () => Action & AnyAction,
  focusedSet: ($id: UID) => Action & AnyAction,
  focusedClear: () => Action & AnyAction,
  selectionSet: ($ids: UID[]) => Action & AnyAction,
  selectionClear: () => Action & AnyAction,
}

export interface DataSliceGeneric {
  key: string,
  name: string,
  initialState: Record<string, any>,
  getInitialState: any,
  action: Partial<DataSliceGenericActions> & Record<string, any>,
  select: Record<string, (...args: any[]) => any>,
  create: any,
}

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
   *
   * Types: string, number, boolean
   */
  $eq?: unknown;

  /**
   * Matches values that do not equal to a specified value.
   *
   * Types: string, number, boolean
   */
  $neq?: unknown;

  /**
   * Matches values that are greater than a specified value.
   *
   * Types: number
   */
  $gt?: number;

  /**
   * Matches values that are greater than or equal to a specified value.
   *
   * Types: number
   */
  $gte?: number;

  /**
   * Matches values that are less than a specified value.
   *
   * Types: number
   */
  $lt?: number;

  /**
   * Matches values that are less than or equal to a specified value.
   *
   * Types: number
   */
  $lte?: number;

  /**
   * Matches values that start with a string.
   *
   * Types: string
   */
  $stw?: string;

  /**
   * Matches values that end with a string.
   *
   * Types: string
   */
  $enw?: string;

  /**
   * Matches values that includes a string.
   *
   * Types: string
   */
  $inc?: string;

  /**
   * Matches values that satisfies the regular expression.
   *
   * Types: string
   */
  $rgx?: string;

  /**
   * Matches any of the values specified in an array.
   *
   * Types: number, string, boolean
   */
  $in?: unknown[];

  /**
   * Matches any of the values specified not in an array.
   *
   * Types: number, string, boolean
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
 * Parameters to wipe all data.
 */
export interface DataWipe {
  /**
   * Spares the specified slice keys from being wiped.
   */
  spare?: string[];
}

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

/**
 * A tree of data.
 */
export type DataTree<D extends Data = Data> = [item: D, children: DataTree<D>][];

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
