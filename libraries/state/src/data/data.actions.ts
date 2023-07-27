/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction } from '@reduxjs/toolkit';
import type {
  Data,
  DataCreator,
  DataDeleter,
  DataMeta,
  DataUpdater,
} from './data.types.js';

export type DataMetaSetter<D extends Data = Data> = Record<string, Partial<DataMeta<D>>>;

export const dataActions = {
  /**
   * Batch set meta information for entities.
   */
  meta: createAction<DataMetaSetter>('@data/meta'),

  /**
   * Batch creates entities.
   */
  insert: createAction<DataCreator>('@data/insert'),

  /**
   * Batch creates entities.
   */
  create: createAction<DataCreator>('@data/create'),

  /**
   * Batch updates entities.
   */
  update: createAction<DataUpdater>('@data/update'),

  /**
   * Batch deletes entities.
   */
  delete: createAction<DataDeleter>('@data/delete'),

  /**
   * Wipes all entity data from the state.
   */
  wipe: createAction('@data/wipe'),
};

export default { dataActions };
