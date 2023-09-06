/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { EntityState } from '@amnis/state/rtk';
import { createSelector } from '@amnis/state/rtk';
import type { UID } from './core/core.types.js';
import type {
  Data, DataQuery, DataRoot, DataState, DataUpdate, Entity, User,
} from './data/index.js';
import type { State } from './state.types.js';
import {
  dataOrder, localeSlice, systemSlice, userSlice,
} from './data/index.js';
import type { RootState } from './store.js';

export interface DataComparison<D extends Data> {
  original: D | undefined;
  current: D | undefined;
  changes: DataRoot<D>;
  updater: DataUpdate<D>;
  keys: (keyof D)[];
}

/**
 * Selects the slice for the given key.
 */
const sliceByKey = <D extends Data = Data>(sliceKey: string) => (state: State) => {
  const slice = state[sliceKey] as DataState<D>;

  if (!slice?.entities) {
    return undefined;
  }

  return slice;
};

export type GetSelectQueryResult<T extends Record<string, any>> = {
  [key in keyof T]?: T[key] extends EntityState<infer D, any> ? D[] : [];
};

export type SelectQueryResult = GetSelectQueryResult<RootState>;

/**
 * Selects entities on slices based on a data query.
 */
const query = createSelector(
  [
    (state: RootState) => state,
    (state, query: DataQuery) => query,
  ],
  (state, query): SelectQueryResult => {
    const result: Record<string, any[]> = {};

    Object.keys(query).forEach((sliceKey) => {
      const key = sliceKey as keyof RootState;
      const slice = state[key] as DataState;

      if (!slice?.entities) {
        return;
      }

      const data: Data[] = Object.values(slice.entities);
      result[key] = data;

      /**
       * Define the start index and limit.
       */
      const start = query[key].$range?.start ?? 0;
      const limit = query[key].$range?.limit ?? 999999;

      const queryOptions = query[key].$query;
      if (!queryOptions) {
        return;
      }
      Object.keys(queryOptions).forEach((queryKey) => {
        const entityKey = queryKey as keyof Data;
        const filter = queryOptions[queryKey];

        result[key] = dataOrder(
          result[key],
          query[key].$order,
        ).filter((entity) => {
          if (!filter) {
            return true;
          }

          const filterKeyLength = Object.keys(filter).length;
          let matches = 0;

          if (filter.$eq !== undefined && filter.$eq === entity[entityKey]) {
            matches += 1;
          }

          if (filter.$neq !== undefined && filter.$neq !== entity[entityKey]) {
            matches += 1;
          }

          if (
            filter.$lt !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) < filter.$lt
          ) {
            matches += 1;
          }

          if (
            filter.$lte !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) <= filter.$lte
          ) {
            matches += 1;
          }

          if (
            filter.$gt !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) > filter.$gt
          ) {
            matches += 1;
          }

          if (
            filter.$gte !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) >= filter.$gte
          ) {
            matches += 1;
          }

          if (
            filter.$stw !== undefined
            && typeof entity[entityKey] === 'string'
            && (entity[entityKey] as unknown as string).startsWith(filter.$stw)
          ) {
            matches += 1;
          }

          if (
            filter.$enw !== undefined
            && typeof entity[entityKey] === 'string'
            && (entity[entityKey] as unknown as string).endsWith(filter.$enw)
          ) {
            matches += 1;
          }

          if (
            filter.$inc !== undefined
            && typeof entity[entityKey] === 'string'
            && (entity[entityKey] as unknown as string).includes(filter.$inc)
          ) {
            matches += 1;
          }

          if (filter.$in !== undefined && filter.$in.includes(entity[entityKey])) {
            matches += 1;
          }

          if (filter.$nin !== undefined && !filter.$nin.includes(entity[entityKey])) {
            matches += 1;
          }

          return matches === filterKeyLength;
        });
      });

      /**
       * Apply the start and limit.
       */
      result[key] = result[key].slice(start, start + limit);
    });

    return result as SelectQueryResult;
  },
);

/**
 * Selects a translations for an entity.
 */
const dataTranslation = createSelector(
  [
    (state: State) => state,
    (state, data: Record<string, any>) => data,
  ],
  (state, data) => {
    const tData = { ...data };
    Object.keys(tData).forEach((key) => {
      if (typeof tData[key] === 'string') {
        tData[key] = localeSlice.select.translation(state, tData[key] as string, data) ?? data[key];
      }
    });
    return tData;
  },
);

/**
 * Selects translations for an array of entities.
 */
const dataArrayTranslation = createSelector(
  [
    (state: State) => state,
    (state, dataArray: Record<string, any>[]) => dataArray,
  ],
  (state, dataArray) => {
    const tDataArray = dataArray.map((data) => dataTranslation(state, data));
    return tDataArray;
  },
);

/**
 * Selects translations for an object of entity.
 */
const dataObjectTranslation = createSelector(
  [
    (state: State) => state,
    (state, dataObject: Record<string, Record<string, any>>) => dataObject,
  ],
  (state, dataObject) => {
    const tDataObject = Object.keys(dataObject).reduce(
      (acc, key) => {
        acc[key] = dataTranslation(state, dataObject[key]);
        return acc;
      },
      {} as Record<string, Record<string, any>>,
    );
    return tDataObject;
  },
);

/**
 * Selects the slice for the given key.
 */
const dataById = <D extends Data = Data>(
  sliceKey: string,
  $id: string,
) => createSelector(
  sliceByKey<D>(sliceKey),
  (slice): D | undefined => {
    if (!slice) {
      return undefined;
    }

    return slice.entities[$id] as D | undefined;
  },
);

/**
 * Selects a difference keys from a data entity.
 */
const dataDifferenceKeys = <D extends Data = Data>(
  sliceKey: string,
  $id: string,
) => createSelector(
  sliceByKey<D>(sliceKey),
  (slice): (keyof D)[] | undefined => {
    if (!slice) {
      return undefined;
    }

    return slice.differences[$id as UID];
  },
);

/**
 * Selects the original data entity.
 */
const dataOriginal = <D extends Data = Data>(
  sliceKey: string,
  $id: string,
) => createSelector(
  sliceByKey<D>(sliceKey),
  (slice): D | undefined => {
    if (!slice) {
      return undefined;
    }

    return slice.original[$id as UID] as D | undefined;
  },
);

/**
 * Selects a processed object of comparisons between the original and current data entity.
 */
const dataComparison = <D extends Data = Data>(
  sliceKey: string,
  $id: string,
) => createSelector(
  dataOriginal<D>(sliceKey, $id),
  dataDifferenceKeys<D>(sliceKey, $id),
  dataById<D>(sliceKey, $id),
  (
    original,
    diffKeys,
    current,
  ): DataComparison<D> => {
    const keys = diffKeys ? [...diffKeys as (keyof D)[]] : [] as (keyof D)[];
    const changes = keys.reduce<DataRoot<D>>((acc, k) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /** @ts-ignore */
      acc[k] = current[k];
      return acc;
    }, {} as DataRoot<D>);
    const updater = { $id, ...changes } as DataUpdate<D>;

    return {
      original: original ? { ...original } : undefined,
      current: current ? { ...current } : undefined,
      changes,
      updater,
      keys,
    };
  },
);

/**
 * Selects the flag indicating if the user is an admin or not.
 */
const isUserAdmin = (state: RootState, $userId: UID<User>): boolean => {
  const user = userSlice.select.byId(state, $userId);

  if (!user) {
    return false;
  }

  const systemActive = systemSlice.select.active(state);

  if (!systemActive) {
    return false;
  }

  if (user.$roles.includes(systemActive.$adminRole)) {
    return true;
  }

  return false;
};

/**
 * Selects the flag indicating if the user is an executive or not.
 */
const isUserExec = (state: RootState, $userId: UID<User>): boolean => {
  const user = userSlice.select.byId(state, $userId);

  if (!user) {
    return false;
  }

  const systemActive = systemSlice.select.active(state);

  if (!systemActive) {
    return false;
  }

  if (user.$roles.includes(systemActive.$execRole)) {
    return true;
  }

  return false;
};

/**
 * Selects the flag indicating if the user is an administrator or executive.
 */
const isUserPrivileged = (state: RootState, $userId: UID<User>): boolean => {
  const user = userSlice.select.byId(state, $userId);

  if (!user) {
    return false;
  }

  const systemActive = systemSlice.select.active(state);

  if (!systemActive) {
    return false;
  }

  if (user.$roles.includes(systemActive.$adminRole)) {
    return true;
  }

  if (user.$roles.includes(systemActive.$execRole)) {
    return true;
  }

  return false;
};

const isUserActiveAdmin = (state: RootState): boolean => {
  const userActive = userSlice.select.active(state);

  if (!userActive) {
    return false;
  }

  return isUserAdmin(state, userActive.$id);
};

const isUserActiveExec = (state: RootState): boolean => {
  const userActive = userSlice.select.active(state);

  if (!userActive) {
    return false;
  }

  return isUserExec(state, userActive.$id);
};

const isUserActivePrivileged = (state: RootState): boolean => {
  const userActive = userSlice.select.active(state);

  if (!userActive) {
    return false;
  }

  return isUserPrivileged(state, userActive.$id);
};

const stagedEntities = (state: RootState): Entity[] => {
  const entities = Object.values(state).reduce<Entity[]>((acc, slice) => {
    /** @ts-ignore */
    if (slice?.type !== 'entity' || slice?.differences === undefined) {
      return acc;
    }
    const sliceEntity = slice as DataState<Entity>;

    const unsaved = Object.keys(sliceEntity.differences)
      .map(($id) => sliceEntity.entities[$id])
      .filter((entity) => !!entity) as Entity[];

    acc.push(...unsaved);
    return acc;
  }, [] as Entity[]);
  return entities;
};

export const stateSelect = {
  query,
  sliceByKey,
  dataById,
  dataDifferenceKeys,
  dataOriginal,
  dataTranslation,
  dataArrayTranslation,
  dataObjectTranslation,
  dataComparison,
  isUserAdmin,
  isUserExec,
  isUserPrivileged,
  isUserActiveAdmin,
  isUserActiveExec,
  isUserActivePrivileged,
  stagedEntities,
};

export default stateSelect;
