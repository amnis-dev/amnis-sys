import React from 'react';
import type { Locale } from '@amnis/state';
import { systemSlice } from '@amnis/state';
import { useWebSelector, useReadLazy } from '@amnis/web/react/hooks';

export interface LocaleRows {
  id: string,
  $id1: string,
  name1: string,
  value1: string,
  $id2: string,
  name2: string,
  value2: string,
}

export function useLocaleFetch() {
  const system = useWebSelector(systemSlice.select.active);

  const [codeBase] = React.useState<string | undefined>(system?.languages[0]);
  const [codeTrans] = React.useState<string | undefined>(system?.languages[1]);

  const { result: localeBase } = useReadLazy<Locale>('locale', {
    code: {
      $eq: codeBase ?? 'en',
    },
  });

  const { result: localeTrans } = useReadLazy<Locale>('locale', localeBase.length > 0 ? {
    code: {
      $eq: codeTrans ?? 'de',
    },
    name: {
      $in: localeBase.map((row) => row.name),
    },
  } : undefined);

  console.log({ localeBase, localeTrans });

  return [localeBase, localeTrans];
}

export default useLocaleFetch;
