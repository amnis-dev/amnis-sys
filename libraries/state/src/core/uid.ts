import { nanoid } from '@reduxjs/toolkit';
import { regexUuid } from './regex.js';
import type { UID, UIDList, UIDTree } from './core.types.js';

/**
 * Create a identifier to another type.
 */
export const uid = <T>(key: string, id = nanoid()) => `${key}:${id}` as UID<T>;

/**
 * Validates a unique idenifier.
 */
export const uidValidate = <T>(id: UID<T>): boolean => {
  // Identifiers must be strings.
  if (typeof id !== 'string') return false;

  // Identifiers must be able to split into a tuple.
  const [slice, uuid] = id.split(':');

  // Both tuples must be defined.
  if (!slice || !uuid) return false;

  // Slice names cannot be greater than 24 characters.
  if (slice.length < 1 || slice.length > 24) return false;

  // Regex for UUIDs must be valid.
  if (!regexUuid.test(uuid)) return false;

  // Unique identifier is valid when reaching this point.
  return true;
};

/**
 * Create a new identifier list.
 */
export const uidList = <T>(
  list: UID<T>[] = [],
) => list as UIDList<T>;

/**
 * Create a new identifier list.
 */
export const uidListValidate = <T>(list: UIDList<T>): boolean => {
  if (!Array.isArray(list)) {
    return false;
  }

  const result = !list.some((id) => !uidValidate(id));
  return result;
};

/**
 * Create a new identifier tree.
 */
export const uidTree = <T>(
  tree: [UID<T>, UID<T> | null][] = [],
) => tree as UIDTree<T>;

/**
 * Validates an identifier tree.
 */
export const uidTreeValidate = <T>(tree: UIDTree<T>): boolean => {
  if (!Array.isArray(tree)) {
    return false;
  }

  if (tree.some((tuple) => !Array.isArray(tuple))) {
    return false;
  }

  const ids = tree.map<UID<T>>((tuple) => tuple[0]);

  if (ids.some((id) => !uidValidate(id))) {
    return false;
  }

  if (tree.some((tuple) => tuple[1] !== null && !ids.includes(tuple[1]))) {
    return false;
  }

  return true;
};
