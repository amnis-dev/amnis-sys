/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyAction, Selector } from '@reduxjs/toolkit';
import type { Data } from '../data.types.js';
import { entityCreate } from './entity.js';
import { entityExtraReducers } from './entity.reducers.js';
import type { Entity } from './entity.types.js';
import type { DataSliceOptions } from '../data.slice.js';
import { dataSliceCreate } from '../data.slice.js';

export const entitySliceCreate = <
  M extends Record<string, any>,
  K extends string,
  DataExtended extends Data,
  C extends (minimal: any) => DataExtended,
  A extends Record<string, AnyAction>,
  S extends Record<string, Selector>,
>({
  key,
  create,
  meta = {} as M,
  actions = {} as A,
  selectors = {} as S,
  reducersExtras = [],
  sort = (a, b) => a.$id.localeCompare(b.$id),
  persist = true,
}: DataSliceOptions<K, DataExtended, C, M, A, S, Entity<ReturnType<C>>>) => {
  if (/^[a-z0-9]+$/i.test(key) === false) {
    throw new Error(`Entity key must be alphanumeric: ${key}`);
  }

  /**
   * Create function that builds the entitiy version of the data.
   */
  const createEntity = (
    minimal: Parameters<C>[0],
    entity?: Partial<Entity>,
  ): Entity<ReturnType<C>> => entityCreate(create(minimal), entity) as Entity<ReturnType<C>>;

  const dataSlice = dataSliceCreate({
    key,
    create: createEntity,
    meta: {
      type: 'entity',
      ...meta,
    },
    reducersExtras: [entityExtraReducers, ...reducersExtras],
    sort,
    persist,
  });

  const { action: actionsData, select: selectorsData } = dataSlice;
  const actionsObject = {
    ...actionsData,
    ...actions,
  };

  const selectorsObject = {
    ...selectorsData,
    ...selectors,
  };

  /**
   * ==================================================
   * RETURN
   * --------------------------------------------------
   */
  return {
    key: dataSlice.key,
    name: dataSlice.key,
    initialState: dataSlice.initialState,
    getInitialState: () => dataSlice.initialState,
    action: actionsObject,
    select: selectorsObject,
    create,
    createEntity,
    reducer: dataSlice.reducer,
    slice: dataSlice.slice,
  };
};

export default entitySliceCreate;
