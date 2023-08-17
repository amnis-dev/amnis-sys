import React from 'react';

import type { Locale } from '@amnis/state';
import { localeSlice } from '@amnis/state';
import { apiCrud } from '@amnis/api/react';
import type { QueryResult } from '@amnis/web';
import { useWebSelector } from '@amnis/web';

export const Localization: React.FC = () => {
  const localeEntites = useWebSelector((state) => localeSlice.select.all(state));

  /**
   * Trigger a read.
   */
  apiCrud.useReadQuery({
    [localeSlice.name]: {
      $query: {},
    },
  }) as QueryResult<Locale>;

  return (
    <div>
      <h1>Localization</h1>
      <div>{JSON.stringify(localeEntites, null, 2)}</div>
    </div>
  );
};

export default Localization;
