import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Handle, HandleRoot, HandleMinimal } from './handle.types.js';

const handleKey = 'handle';

export const handleRoot = (): HandleRoot => ({
  name: '',
  $subject: uid('entity'),
});

export function handleCreate(
  handle: HandleMinimal,
): Handle {
  return {
    ...handleRoot(),
    ...handle,
    $id: uid(handleKey),
  };
}

export const handleSlice = entitySliceCreate({
  key: handleKey,
  create: handleCreate,
});
