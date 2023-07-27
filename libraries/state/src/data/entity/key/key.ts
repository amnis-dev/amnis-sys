import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Key } from './key.types.js';

const keyKey = 'key';

export const keyRoot = (): Key => ({
  $id: uid(keyKey),
  name: 'Unknown Key',
  format: 'raw',
  wrapped: false,
  value: '',
});

export function keyCreate(
  key: Key,
): Key {
  return {
    ...keyRoot(),
    ...key,
  };
}

export const keySlice = entitySliceCreate({
  key: keyKey,
  create: keyCreate,
});
