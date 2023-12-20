import React from 'react';
import type { Entity, Locale } from '@amnis/state';
import { localeSlice } from '@amnis/state';
import { WebContext } from '@amnis/web/react';
import { useWebSelector } from './useWebSelector.js';

type ObjectFromList<T extends ReadonlyArray<string>, V = Entity<Locale>> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
};

export type UseLocaleKey = ReadonlyArray<string>;

export function useLocale<K extends UseLocaleKey>(
  keys: K,
): ObjectFromList<K> {
  const { localePush } = React.useContext(WebContext);

  const localeCode = useWebSelector(localeSlice.select.activeCode);

  const [localeValues, localeValuesSet] = React.useState<ObjectFromList<K>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: {} }), {} as ObjectFromList<K>),
  );

  /**
   * First check if the locale is already available on the store.
   */
  const localeNames = useWebSelector((state) => localeSlice.select.state(state).names);
  const localeLocal = React.useMemo(() => keys.reduce((acc, key) => {
    const localeValue = localeNames[key];
    if (localeValue) {
      acc[key] = localeValue as Entity<Locale>;
    }
    return acc;
  }, {} as Record<string, Entity<Locale>>), [localeNames, keys, localeCode]);

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
