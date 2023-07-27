import type { UID } from '../core/core.types.js';
import type { Data, DataMeta } from './data.types.js';

/**
 * Create meta information for data collections.
 */
export function dataMetaInitial<D extends Data = Data>(
  meta: Partial<DataMeta<D>> = {},
): DataMeta<D> {
  return {
    type: 'data',
    active: null,
    focused: null,
    selection: [],
    new: {} as Record<UID, boolean>,
    original: {} as Record<UID, D>,
    differences: {} as Record<UID, (keyof D)[]>,
    ...meta,
  };
}

export default dataMetaInitial;
