/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Entity } from './entity.types.js';
import { entityKeys } from './entity.js';

type SameRecord<T> = { [N in keyof T]: T[N] }

interface DiffCompareOptions {
  includeEntityKeys?: boolean;
}

/**
 * Compares two of the same type of object and returns the keys that are different.
 */
export function diffCompare<R1 extends { [key: string]: any }>(
  record1: R1,
  record2: SameRecord<R1>,
  options?: DiffCompareOptions,
): (keyof R1)[] {
  const { includeEntityKeys = true } = { ...options };
  const result: (keyof R1)[] = [];
  Object.keys(record1).forEach((key: keyof R1) => {
    /**
     * Ignore entity keys.
     */
    if (!includeEntityKeys && entityKeys.includes(key as keyof Entity)) {
      return;
    }
    /**
     * Compare equality of an array.
     */
    if (Array.isArray(record1[key])) {
      const arr1 = record1[key] as Array<any>;
      const arr2 = record2[key] as Array<any>;
      if (arr1.length !== arr2.length) {
        result.push(key);
      } else if (!arr1.every((e, i) => e === arr2[i])) {
        result.push(key);
      }
      return;
    }

    /**
     * Compare equality of object (shallow).
     */
    if (typeof record1[key] === 'object' && record1[key] !== null) {
      const obj1 = record1[key] as Record<string, unknown>;
      const obj2 = record2[key] as Record<string, unknown>;
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        result.push(key);
      } else if (!Object.keys(obj1).every(
        (keyObj: keyof typeof obj1) => (obj1[keyObj] === obj2[keyObj]),
      )) {
        result.push(key);
      }
      return;
    }

    /**
     * Compare any other type.
     */
    if (record1[key] !== record2[key]) {
      result.push(key);
    }
  });
  return result;
}

/**
 * Returns an object containing only the changed differences.
 */
export function diffChanges<R1 extends { [key: string]: any }>(
  original: R1,
  current: SameRecord<R1>,
): { original: Partial<R1>, current: Partial<R1> } {
  const diffKeys = diffCompare(original, current);

  const originalResult = diffKeys.reduce<Partial<R1>>((acc, key) => {
    acc[key] = original[key];
    return acc;
  }, {} as Partial<R1>);

  const currentResult = diffKeys.reduce<Partial<R1>>((acc, key) => {
    acc[key] = current[key];
    return acc;
  }, {} as Partial<R1>);

  return { original: originalResult, current: currentResult };
}
