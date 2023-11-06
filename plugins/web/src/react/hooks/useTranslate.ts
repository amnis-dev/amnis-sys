import React from 'react';
import { useStore } from 'react-redux';
import { localeSlice, stateSelect } from '@amnis/state';
import type { UID } from '@amnis/state';
import { useWebSelector } from './useWebSelector.js';

type R = Record<string, any>;

/**
 * Translates a data object or array of data objects.
 */
export function useTranslate<
  T extends R | R[] | Record<string | UID, R>
>(
  record: T | undefined,
): T extends R ? (T | undefined) : T {
  const store = useStore();
  const localeNames = useWebSelector((state) => localeSlice.select.state(state).names);

  const result = React.useMemo<T | undefined>(() => {
    if (!record) {
      return undefined;
    }
    if (Array.isArray(record)) {
      const translated = stateSelect.dataArrayTranslation(
        store.getState(),
        record,
      ) as T;
      return translated;
    }

    const translated = stateSelect.dataTranslation(store.getState(), record) as T;
    return translated;
  }, [record, localeNames]);

  return result as T extends R ? (T | undefined) : T;
}

export default useTranslate;
