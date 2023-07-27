import { uid } from '../../../core/index.js';
import type { DataMinimal, DataRoot } from '../../data.types.js';
import type { Permit } from './permit.types.js';

export const permitKey = 'permit';

export const permitRoot: DataRoot<Permit> = {
  $issuer: uid('user'),
  $holder: uid('user'),
  $target: uid('entity'),
  grants: [],
};

export function permitCreate(
  permit: DataMinimal<Permit, '$issuer' | '$holder' | '$target'>,
): Permit {
  return {
    ...permitRoot,
    ...permit,
    $id: uid(permitKey),
  };
}
