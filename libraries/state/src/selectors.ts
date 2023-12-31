/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { EntityState } from '@amnis/state/rtk';
import { createSelector } from '@amnis/state/rtk';
import type { UID, UIDTree } from './core/core.types.js';
import type {
  Data,
  DataMeta,
  DataQuery,
  DataRoot,
  DataState,
  DataTree,
  DataUpdate,
  Entity,
  User,
} from './data/index.js';
import type { State } from './state.types.js';
import {
  dataOrder,
  localeSlice,
  systemSlice,
  userSlice,
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
const sliceByKey = createSelector(
  [
    (state: RootState) => state,
    (state, sliceKey: string) => sliceKey as keyof RootState,
  ],
  (state, sliceKey): DataState | undefined => {
    if (!state[sliceKey]) {
      return undefined;
    }

    return state[sliceKey] as DataState;
  },
);

/**
 * Selects the entities object for the given slice key.
 */
const sliceEntities = createSelector(
  [
    (state: RootState) => state,
    sliceByKey,
  ],
  (state, slice): Record<string, Data> => {
    if (!slice) {
      return {};
    }

    return slice.entities;
  },
);

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
      if (typeof tData[key] === 'object') {
        if (Array.isArray(tData[key])) {
          tData[key] = tData[key].map((item: any) => {
            if (typeof tData[key] === 'string') {
              return localeSlice.select.translation(state, tData[key] as string, data) ?? data[key];
            }
            if (typeof tData[key] === 'object' && !Array.isArray(tData[key])) {
              return dataTranslation(state, item);
            }
            return item;
          });
        } else {
          tData[key] = dataTranslation(state, tData[key]);
        }
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
  (state: any) => sliceByKey(state, sliceKey),
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
  (state: any) => sliceByKey(state, sliceKey),
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
  (state: any) => sliceByKey(state, sliceKey),
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
 * Selects all differences on the state.
 */
const entityDifferences = createSelector(
  [
    (state) => state as Record<string, EntityState<Entity, string> & DataMeta<Entity>>,
  ],
  (state) => {
    const differenceIds = Object.keys(state).filter(
      (sliceKey) => state[sliceKey].type === 'entity',
    ).map(
      (sliceKey) => state[sliceKey] as EntityState<Entity, string> & DataMeta<Entity>,
    ).reduce<string[]>(
      (acc, slice) => {
        const $ids = Object.keys(slice.differences);
        if (!$ids.length) {
          return acc;
        }
        acc.push(...$ids);
        return acc;
      },
      [] as string[],
    );

    return differenceIds.map<
    DataComparison<Entity> & { sliceKey: string }
    >(
      ($id) => {
        const sliceKey = $id.split(':')[0];
        const difference = dataComparison<Entity>(sliceKey, $id)(state);
        return { ...difference, sliceKey };
      },
    );
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

const unsavedEntities = (state: RootState): Entity[] => {
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

/**
 * Returns the number of entity differences.
 */
const entityDifferenceCount = createSelector(
  unsavedEntities,
  (staged) => staged.length,
);

/**
 * Returns all entities in the state.
 */
const allEntities = (state: any): Entity[] => {
  const entitySlices = Object.keys(state).filter(
    (sliceKey) => !['log', 'session'].includes(sliceKey) && state[sliceKey].type === 'entity',
  );
  const entities = entitySlices.map((sliceKey) => {
    const slice = state[sliceKey] as DataState<Entity>;
    return Object.values(slice.entities);
  }).flat();
  return entities;
};

const allEntitiesMap = (state: any): Record<UID, Entity> => {
  const entitySlices = Object.keys(state).filter(
    (sliceKey) => !['log', 'session'].includes(sliceKey) && state[sliceKey].type === 'entity',
  );
  const entities = entitySlices.reduce<Record<UID, Entity>>(
    (acc, sliceKey) => {
      const slice = state[sliceKey] as DataState<Entity>;
      return { ...acc, ...slice.entities };
    },
    {} as Record<UID, Entity>,
  );
  return entities;
};

/**
 * Returns all entity IDs that are staged for saving.
 *
 * This includes created, updated, and deleted entities.
 */
const staged = createSelector(
  allEntities,
  (entities) => entities.filter((entity) => entity.committed === false),
);

/**
 * Returns the count of all entities that are staged for saving.
 */
const stagedCount = createSelector(
  staged,
  (entities) => entities.length,
);

/**
 * Selects only new staged entities.
 */
const stagedCreate = createSelector(
  staged,
  (entities) => entities.filter((entity) => entity.new === true),
);

/**
 * Selects only updated staged entities.
 */
const stagedUpdate = createSelector(
  staged,
  (entities) => entities.filter((entity) => entity.new === false && entity.committed === false),
);

/**
 * Selects only deleted staged entities.
 */
const stagedDelete = createSelector(
  staged,
  (entities) => entities.filter((entity) => entity.delete === true),
);

/**
 * Selects all entities in a UID Tree.
 */
const entityTreeFlat = createSelector(
  [
    (state, tree: UIDTree) => tree,
    allEntitiesMap,
  ],
  (tree, entities) => {
    tree.reduce<Record<UID, Entity>>((acc, [$idCurrent, $idParent]) => {
      if (!acc[$idCurrent]) {
        const entity = entities[$idCurrent];
        acc[$idCurrent] = entity;
      }
      if ($idParent && !acc[$idParent]) {
        const entity = entities[$idParent];
        acc[$idParent] = entity;
      }
      return acc;
    }, {} as Record<UID, Entity>);
    return entities;
  },
);

function dataTreeRecursive(
  tree: UIDTree,
  entities: Record<UID, Entity>,
  $root: UID | null,
): DataTree<Entity> {
  const array: DataTree<Entity> = [];
  const roots = tree.filter(([, $idParent]) => $idParent === $root);
  roots.forEach(([$idCurrent]) => {
    const entity = entities[$idCurrent];
    const children = dataTreeRecursive(tree, entities, $idCurrent);
    array.push([entity, children]);
  });
  return array;
}

/**
 * Selects a nested array of entities from a UID Tree.
 */
const entityTree = createSelector(
  [
    (state, tree: UIDTree) => tree,
    entityTreeFlat,
  ],
  (tree, entities) => dataTreeRecursive(tree, entities, null),
);

export const stateSelect = {
  query,
  sliceByKey,
  sliceEntities,
  dataById,
  dataDifferenceKeys,
  dataOriginal,
  dataTranslation,
  dataArrayTranslation,
  dataObjectTranslation,
  dataComparison,
  entityDifferences,
  entityDifferenceCount,
  isUserAdmin,
  isUserExec,
  isUserPrivileged,
  isUserActiveAdmin,
  isUserActiveExec,
  isUserActivePrivileged,
  unsavedEntities,
  staged,
  stagedCount,
  stagedCreate,
  stagedUpdate,
  stagedDelete,
  entityTreeFlat,
  entityTree,
};

export default stateSelect;
