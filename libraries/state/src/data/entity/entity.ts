import {
  uid,
  uidList,
  regexReference,
  regexUuid,
  dateJSON,
} from '../../core/index.js';
import type { UID } from '../../core/index.js';
import type {
  Entity,
} from './entity.types.js';
import type { Data } from '../data.types.js';

/**
 * Creates an entity.
 */
export const entityCreate = <C extends Data>(
  creator: C,
  set?: Partial<Entity<C>> | boolean,
): Entity<C> => {
  const id = creator.$id as UID<C>;
  const now = dateJSON();
  const entity: Entity = {
    $id: id,
    created: now,
    updated: now,
    delete: false,
    $owner: id,
    $readers: uidList(),
    $creator: id,
    committed: false,
    new: true,
  };

  const overwrite: Partial<Entity> = typeof set === 'boolean' ? {
    $owner: id,
  } : set || {};

  return {
    ...entity,
    ...creator,
    ...overwrite,
  } as Entity<C>;
};

/**
 * Modifies an entity.
 */
export const entityUpdate = <
  C extends Data,
  E extends Entity<C>
>(
  target: E,
  modification: Partial<E>,
): E => {
  const now = new Date().toJSON();
  const result: E = {
    ...target,
    ...modification,
    updated: now,
  };
  return result;
};

/**
 * Array of entity prop keys.
 */
export const entityKeys: (keyof Entity)[] = Object.keys(
  entityCreate({
    $id: uid('entity'),
  }),
).map((key) => key as keyof Entity);

/**
 * Checks if an object has all the required entity keys.
 */
export const entityHasKeys = <C extends Data>(
  entity: Entity<C>,
): boolean => entityKeys.every((key) => key in entity);

/**
 * Cleans and validates base entity keys and references for further processing.
 * TODO: This method can most certainly be made more efficient.
 */
export function entityClean<C extends Data>(
  key: string,
  entity: Entity<C>,
): C | undefined {
  let errored = false;
  const cleaned = Object.keys(entity)
    .reduce<Record<string, unknown>>((value, p) => {
    const prop = p as keyof Entity;
    if (prop === '$id' || !entityKeys.includes(prop)) {
      if (prop === '$id') {
        const [sKey, id] = (entity[prop] as string).split(':');
        if (sKey === key && regexUuid.test(id)) {
          value[prop] = entity[prop];
        } else {
          errored = true;
        }
        /**
       * Only references/identifier arrays begin with a '$' character.
       * Also enure they have valid ids.
       */
      } else if (prop.charAt(0) === '$') {
        /**
         * The property value being an array indicates that this is
         * a list or tree identification type.
         */
        if (Array.isArray(entity[prop])) {
          (entity[prop] as string[]).every((id: string | string[]) => {
            if (Array.isArray(id)) {
              if (!regexReference.test(id[0])) {
                errored = true;
                return false;
              }
              if (id[1] && !regexReference.test(id[1])) {
                errored = true;
                return false;
              }
            } else if (!regexReference.test(id)) {
              errored = true;
              return false;
            }
            return true;
          });
          /**
         * If the property value is not an array, it must sinply be an
         * identifier string.
         */
        } else if (!regexReference.test(entity[prop] as string)) {
          errored = true;
        }
        value[prop] = entity[prop];
      } else {
        value[prop] = entity[prop];
      }
    }
    return value;
  }, {});

  return errored ? undefined : cleaned as C;
}

/**
 * Strips an entity to a creator object.
 */
export const entityStrip = <C extends Data>(
  entity: Entity<C>,
): C => {
  const result = Object.keys(entity).reduce<C>((entityNew, key) => {
    const k = key as keyof Entity;
    if (k === '$id' || !entityKeys.includes(k)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /** @ts-ignore */
      entityNew[k] = entity[k];
    }
    return entityNew;
  }, { $id: '' } as C);

  return result;
};
