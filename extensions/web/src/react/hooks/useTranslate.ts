import React from 'react';
import { useStore } from 'react-redux';
import { stateSelect } from '@amnis/state';
import type { UID, Entity } from '@amnis/state';

export function useTranslate<T extends Entity | Entity[] | Record<string | UID, Entity>>(
  entity: T | undefined,
): T extends Entity ? (T | undefined) : T {
  const store = useStore();

  const result = React.useMemo<T | undefined>(() => {
    if (!entity) {
      return undefined;
    }
    if (Array.isArray(entity)) {
      const translated = stateSelect.dataArrayTranslation(
        store.getState(),
        entity,
      ) as T;
      return translated;
    } if (entity.$id === undefined) {
      const translated = stateSelect.dataObjectTranslation(
        store.getState(),
        entity as Record<string, Entity>,
      ) as T;
      return translated;
    }
    const translated = stateSelect.dataTranslation(store.getState(), entity) as T;
    return translated;
  }, [entity]);

  return result as T extends Entity ? (T | undefined) : T;
}

export default useTranslate;
