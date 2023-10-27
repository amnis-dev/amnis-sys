import React from 'react';
import { localeSlice } from '@amnis/state';
import { apiSys } from '@amnis/api';
import { createSelector } from '@amnis/state/rtk';
import { useWebSelector } from './useWebSelector.js';
import { useWebDispatch } from './useWebDispatch.js';

type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
};

export type UseLocaleKey = ReadonlyArray<string>;

const selectLocaleRecord = createSelector(
  [
    (state: any) => localeSlice.select.state(state).names,
    (state, keys: string[]) => keys,
  ],
  (names, keys) => keys.reduce((acc, key) => {
    const localeValue = names[key];
    if (localeValue) {
      acc[key] = localeValue.value;
    }
    return acc;
  }, {} as Record<string, string>),
);

export function useLocale<K extends React.MutableRefObject<UseLocaleKey>>(
  keys: K,
): ObjectFromList<K['current']> {
  const dispatch = useWebDispatch();

  const [localeValues, localeValuesSet] = React.useState<ObjectFromList<K['current']>>(
    keys.current.reduce((acc, key) => ({ ...acc, [key]: '...' }), {} as ObjectFromList<K['current']>),
  );

  /**
   * First check if the locale is already available on the store.
   */
  const localeLocal = useWebSelector(
    (state) => selectLocaleRecord(state, keys.current as string[]),
  ) as ObjectFromList<K['current']>;

  const localeLocalLength = React.useMemo(() => Object.keys(localeLocal).length, [localeLocal]);

  React.useEffect(() => {
    if (keys.current.length !== localeLocalLength) {
      dispatch(apiSys.endpoints.locale.initiate({
        keys: keys.current as string[],
      }));
    }

    localeValuesSet({
      ...localeValues,
      ...localeLocal,
    });
  }, [localeLocalLength]);

  return localeValues;
}
