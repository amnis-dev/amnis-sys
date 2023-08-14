import type { Entity } from '@amnis/state';

export function ider<E extends Entity>(entity?: E, prop?: keyof E): string | undefined {
  return entity && `${entity.$id}${prop ? `.${prop as string}` : ''}`;
}

export default ider;
