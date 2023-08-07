import React from 'react';
import { useStore } from 'react-redux';
import { stateSelect, type Entity } from '@amnis/state';

export function useTranslate<T extends Entity | Entity[]>(entity: T | undefined): T | undefined {
  const store = useStore();

  const result = React.useMemo<T | undefined>(() => {
    if (!entity) {
      return undefined;
    }
    if (Array.isArray(entity)) {
      const translated = stateSelect.dataArrayTranslation(store.getState(), entity) as T;
      return translated;
    }
    const translated = stateSelect.dataTranslation(store.getState(), entity) as T;
    return translated;
  }, [entity]);

  return result;
}

export default useTranslate;
