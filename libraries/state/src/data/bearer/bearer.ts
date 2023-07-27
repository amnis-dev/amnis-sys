/* eslint-disable no-bitwise */
import { dataSliceCreate } from '../data.slice.js';
import type {
  Bearer,
} from './bearer.types.js';

export const bearerKey = 'bearer';

export function bearerCreate(
  bearer: Bearer,
): Bearer {
  const bearerNew: Bearer = {
    ...bearer,
  };

  return bearerNew;
}

export const bearerSlice = dataSliceCreate({
  key: bearerKey,
  create: bearerCreate,
});
