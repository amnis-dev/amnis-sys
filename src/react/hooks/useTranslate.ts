import React from 'react';
import { useSelector } from 'react-redux';
import { stateSelect, type Entity } from '@amnis/state';

export function useTranslate<T extends Entity | Entity[]>(entity: T | undefined): T | undefined {
  const state = useSelector((state) => state);

  const result = React.useMemo<T | undefined>(() => {
    if (!entity) {
      return undefined;
    }
    if (Array.isArray(entity)) {
      const translated = stateSelect.dataArrayTranslation(state, entity) as T;
      return translated;
    }
    const translated = stateSelect.dataTranslation(state, entity) as T;
    return translated;
  }, [entity]);

  return result;
}

export default useTranslate;
