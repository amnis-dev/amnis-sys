import React from 'react';
import { uid } from '@amnis/state';

export function useId(): string {
  const id = React.useMemo(() => uid('webid'), []);

  return id;
}

export default useId;
