/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Action, Comparer, Selector,
} from '@reduxjs/toolkit';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type {
  Data, DataExtraReducers, DataMeta, DataState, DataUpdate,
} from './data.types.js';
import type { State } from '../state.types.js';
import type { UID } from '../core/core.types.js';
import { dataExtraReducers, extraReducersApply } from './data.reducers.js';
import { dataActions } from './data.actions.js';
import { dataSelectors } from './data.selectors.js';
import { dataMetaInitial } from './data.meta.js';
import { localStorage } from '../localstorage.js';
import { localInfoGet } from '../localinfo.js';

export interface DataSliceOptions<
  K extends string = string,
  D extends Data = Data,
  C extends (minimal: any) => D = () => D,
  M extends Record<string, any> = object,
  A extends Record<string, Action> = Record<string, Action>,
  S extends Record<string, Selector> = Record<string, Selector>,
  B extends ReturnType<C> = ReturnType<C>,
> {
  key: K;
  create: C;
  meta?: M & Partial<DataMeta>;
  actions?: A;
  selectors?: S;
  reducersExtras?: DataExtraReducers<B, M>[];
  sort?: Comparer<B>;
  persist?: boolean;
}

export const dataSliceCreate = <
  M extends Record<string, any>,
  K extends string,
  DataExtended extends Data,
  C extends (minimal: any) => DataExtended,
  A extends Record<string, Action>,
  S extends Record<string, Selector>,
>({
  key,
  create,
  meta,
  actions = {} as A,
  selectors = {} as S,
  reducersExtras = [],
  sort = (a, b) => a.$id.localeCompare(b.$id),
  persist = false,
}: DataSliceOptions<K, DataExtended, C, M, A, S, ReturnType<C>>) => {
  type D = Data & ReturnType<C>;

  if (/^[a-z0-9]+$/i.test(key) === false) {
    throw new Error(`Data key must be alphanumeric: ${key}`);
  }

  let storedMeta = {};
  let storedEntities = [];
  if (persist) {
    try {
      /**
       * Load meta data from local storage.
       */
      storedMeta = JSON.parse(localStorage().getItem(`${localInfoGet().uid}-state-${key}-meta`) ?? '{}');

      /**
       * Load entities from local storage.
       */
      storedEntities = JSON.parse(localStorage().getItem(`${localInfoGet().uid}-state-${key}-entities`) ?? '[]');
    } catch (e) {
      console.error('There was an error loading the state data from local storage.');
    }
  }

  const adapter = createEntityAdapter<D, string>({
    selectId: (entity) => entity.$id,
    sortComparer: sort,
  });

  const initialState = adapter.getInitialState({
    ...dataMetaInitial(meta),
    ...storedMeta,
  }) as DataState<D> & M;

  const nextState = adapter.upsertMany(initialState, storedEntities);

  const reducersExtraArray: DataExtraReducers<D, M>[] = [];
  reducersExtraArray.push(dataExtraReducers);
  reducersExtraArray.push(...reducersExtras);

  const slice = createSlice({
    name: key,
    initialState: nextState,
    reducers: {},
    extraReducers: (builder) => {
      extraReducersApply<D, M>({
        key,
        adapter,
        builder,
        options: {
          save: persist,
        },
      }, reducersExtraArray);
    },
  });

  const actionsObject = {
    insert: (insert: D) => dataActions.create({
      [key]: [insert],
    }),
    insertMany: (inserts: D[]) => dataActions.create({
      [key]: inserts,
    }),
    create: (minimal: Parameters<C>[0]) => dataActions.create({
      [key]: [create(minimal)],
    }),
    createMany: (minimals: Parameters<C>[0][]) => dataActions.create({
      [key]: minimals.map((minimal) => create(minimal)),
    }),
    update: (update: DataUpdate<D>) => dataActions.update({
      [key]: [update],
    }),
    updateMany: (updates: DataUpdate<D>[]) => dataActions.update({
      [key]: updates,
    }),
    delete: ($id: UID) => dataActions.delete({
      [key]: [$id],
    }),
    deleteMany: ($ids: UID[]) => dataActions.delete({
      [key]: $ids,
    }),
    activeSet: ($id: UID) => dataActions.meta({
      [key]: {
        active: $id,
      },
    }),
    activeClear: () => dataActions.meta({
      [key]: {
        active: null,
      },
    }),
    focusedSet: ($id: UID) => dataActions.meta({
      [key]: {
        focused: $id,
      },
    }),
    focusedClear: () => dataActions.meta({
      [key]: {
        focused: null,
      },
    }),
    selectionSet: ($ids: UID[]) => dataActions.meta({
      [key]: {
        selection: [...$ids],
      },
    }),
    selectionClear: () => dataActions.meta({
      [key]: {
        selection: [],
      },
    }),
    ...actions,
  };

  /**
   * ==================================================
   * SELECTORS
   * --------------------------------------------------
   */
  const selectorsAdapter = adapter.getSelectors<State>((state) => state[key]);
  const selectorsAdapterRenamed = {
    ids: selectorsAdapter.selectIds,
    entities: selectorsAdapter.selectEntities,
    all: selectorsAdapter.selectAll,
    total: selectorsAdapter.selectTotal,
    byId: selectorsAdapter.selectById,
  };
  const selectorsData = dataSelectors<D>(key);
  const selectorsObject = {
    ...selectorsAdapterRenamed,
    ...selectorsData,
    ...selectors,
  };

  /**
   * ==================================================
   * RETURN
   * --------------------------------------------------
   */
  return {
    key,
    name: key,
    initialState,
    getInitialState: () => initialState,
    action: actionsObject,
    select: selectorsObject,
    create: create as typeof create,
    reducer: slice.reducer,
    slice,
  };
};
