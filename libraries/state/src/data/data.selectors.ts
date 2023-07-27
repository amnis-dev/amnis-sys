/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSelector } from '@reduxjs/toolkit';
import type { State } from '../state.types.js';
import type { UID } from '../core/index.js';
import type {
  Data,
  DataRoot,
  DataState,
  DataUpdate,
} from './data.types.js';

/**
 * Creates a slice selector.
 */
const genSelectSlice = <C extends Data>(sliceKey: string) => (state: State) => {
  const slice = state[sliceKey] as DataState<C>;

  if (!slice?.entities) {
    return undefined;
  }

  return slice;
};

/**
 * Creates an entity dictionary selector.
 */
const genSelectEntities = <D extends Data>(sliceKey: string) => (state: State) => (
  genSelectSlice<D>(sliceKey)(state)?.entities ?? ({} as Record<string, D>)
);

/**
 * Creates an original entity dictionary selector.
 */
const genSelectOriginals = <D extends Data>(sliceKey: string) => (state: State) => (
  genSelectSlice<D>(sliceKey)(state)?.original ?? ({} as Record<UID<D>, D>)
);

/**
 * Creates an original entity dictionary selector.
 */
const genSelectDifferences = <D extends Data>(sliceKey: string) => (state: State) => (
  genSelectSlice<D>(sliceKey)(state)?.differences ?? ({} as Record<UID<D>, (keyof D)[]>)
);

/**
 * Creates an active id selector.
 */
const genSelectActiveId = <D extends Data>(sliceKey: string) => (state: State) => (
  genSelectSlice<D>(sliceKey)(state)?.active ?? null
);

/**
 * Creates a focused id selector.
 */
const genSelectFocusedId = <D extends Data>(sliceKey: string) => (state: State) => (
  genSelectSlice<D>(sliceKey)(state)?.focused ?? null
);

/**
 * Creates a selected ids selector.
 */
const genSelectSelectionIds = <D extends Data>(sliceKey: string) => (state: State) => (
  genSelectSlice<D>(sliceKey)(state)?.selection ?? []
);

/**
 * Selects the focused entity on a slice (if one is active).
 */
const genSelectActive = <D extends Data = Data>(sliceKey: string) => createSelector(
  genSelectActiveId<D>(sliceKey),
  genSelectEntities<D>(sliceKey),
  (activeId, entities): D | undefined => {
    if (!activeId) {
      return undefined;
    }

    const entity = entities?.[activeId] as D;

    if (!entity) {
      return undefined;
    }

    return entity;
  },
);

export const selectActive = <D extends Data>(
  state: State, sliceKey: string,
) => genSelectActive<D>(sliceKey)(state);

/**
 * Selects the focused entity on a slice (if one is active).
 */
const genSelectFocused = <D extends Data = Data>(sliceKey: string) => createSelector(
  genSelectFocusedId<D>(sliceKey),
  genSelectEntities<D>(sliceKey),
  (focusedId, entities): D | undefined => {
    if (!focusedId) {
      return undefined;
    }

    const entity = entities?.[focusedId] as D;

    if (!entity) {
      return undefined;
    }

    return entity;
  },
);

export const selectFocused = <E extends Data>(
  state: State, sliceKey: string,
) => genSelectFocused<E>(sliceKey)(state);

/**
 * Selects the focused entity on a slice (if one is active).
 */
const genSelectSelection = <E extends Data = Data>(
  sliceKey: string,
) => createSelector(
  genSelectSelectionIds<E>(sliceKey),
  genSelectEntities<E>(sliceKey),
  (selectionIds, entities) => {
    /** @ts-ignore */
    const selections = selectionIds.map((selected) => entities[selected]) as E[];

    return selections;
  },
);

export const selectSelection = <D extends Data>(
  state: State, sliceKey: string,
) => genSelectSelection<D>(sliceKey)(state);

export interface EntityDifference<D extends Data> {
  original: D | undefined;
  current: D | undefined;
  changes: DataRoot<D>;
  updater: DataUpdate<D>;
  keys: (keyof D)[];
}

/**
 * Selects an object to differentiate local updates.
 */
const genSelectDifference = <D extends Data = Data>(
  sliceKey: string,
) => createSelector(
  [
    (state, id: string) => id,
    genSelectDifferences<D>(sliceKey),
    genSelectOriginals<D>(sliceKey),
    genSelectEntities<D>(sliceKey),
  ],
  (
    id,
    diffRecords,
    originalRecords,
    entities,
  ): EntityDifference<D> => {
    const current = entities[id] as D | undefined;
    const original = originalRecords[id as UID] as D | undefined;
    const diffRecord = diffRecords[id as UID];
    const keys = diffRecord ? [...diffRecord as (keyof D)[]] : [] as (keyof D)[];

    const changes = keys.reduce<DataRoot<D>>((acc, k) => {
      /** @ts-ignore */
      acc[k] = current[k];
      return acc;
    }, {} as DataRoot<D>);
    const updater = { $id: id, ...changes } as DataUpdate<D>;

    return {
      original: original ? { ...original } : undefined,
      current: current ? { ...current } : undefined,
      changes,
      updater,
      keys,
    };
  },
);

export interface CoreSelectors<D extends Data> {
  active: (state: State) => D | undefined,
  focused: (state: State) => D | undefined,
  selection: (state: State) => D[],
  difference: (state: State, $id: UID) => EntityDifference<D>,
}

/**
 * Create the selector utility object.
 */
export function dataSelectors<D extends Data>(sliceKey: string): CoreSelectors<D> {
  return {
    active: genSelectActive<D>(sliceKey),
    focused: genSelectFocused<D>(sliceKey),
    selection: genSelectSelection<D>(sliceKey),
    difference: genSelectDifference<D>(sliceKey),
  };
}
