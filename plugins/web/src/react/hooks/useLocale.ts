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

export function useLocale<K extends UseLocaleKey>(
  keys: K,
): ObjectFromList<K> {
  const dispatch = useWebDispatch();

  const localeCode = useWebSelector((state) => localeSlice.select.state(state).code);

  const [localeValues, localeValuesSet] = React.useState<ObjectFromList<K>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: '...' }), {} as ObjectFromList<K>),
  );

  /**
   * First check if the locale is already available on the store.
   */
  const localeLocal = useWebSelector(
    (state) => selectLocaleRecord(state, [...keys]),
  ) as ObjectFromList<K>;

  const localeLocalLength = React.useMemo(() => Object.keys(localeLocal).length, [localeLocal]);

  React.useEffect(() => {
    if (keys.length !== localeLocalLength) {
      dispatch(apiSys.endpoints.locale.initiate({
        keys: [...keys],
      }));
    }

    localeValuesSet({
      ...localeValues,
      ...localeLocal,
    });
  }, [localeLocalLength, keys]);

  // React.useEffect(() => {

  // }, [localeCode]);
  return localeValues;
}
