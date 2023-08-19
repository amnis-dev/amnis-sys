import React from 'react';
import { systemSlice } from '@amnis/state';
import { useWebSelector } from '@amnis/web/react';

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

  const [codeBase, codeBaseSet] = React.useState<string | undefined>(system?.languages[0]);
  const [codeTrans, codeTransSet] = React.useState<string | undefined>(system?.languages[1]);
}

export default useLocaleFetch;
