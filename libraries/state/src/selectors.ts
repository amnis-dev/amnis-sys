/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSelector } from '@reduxjs/toolkit';
import type { UID } from './core/core.types.js';
import type {
  Data, DataRoot, DataState, DataUpdate, Entity, User,
} from './data/index.js';
import type { State } from './state.types.js';
import { systemSlice, userSlice } from './data/index.js';
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
  sliceByKey,
  dataById,
  dataDifferenceKeys,
  dataOriginal,
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
