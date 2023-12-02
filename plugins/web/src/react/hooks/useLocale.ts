import React from 'react';
import { localeSlice } from '@amnis/state';
import { createSelector } from '@amnis/state/rtk';
import { WebContext } from '@amnis/web/react';
import { useWebSelector } from './useWebSelector.js';

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
  const { localePush } = React.useContext(WebContext);

  const localeCode = useWebSelector(localeSlice.select.activeCode);

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
    if (!keys.length) return;

    localePush(keys);

    localeValuesSet({
      ...localeValues,
      ...localeLocal,
    });
  }, [localeLocalLength, keys, localeCode]);

  // React.useEffect(() => {

  // }, [localeCode]);
  return localeValues;
}
