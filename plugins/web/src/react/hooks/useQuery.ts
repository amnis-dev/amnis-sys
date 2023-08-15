import React from 'react';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import type { RootStateWeb } from '../../types.js';
import { useWebDispatch } from './useWebDispatch.js';

export function useQuery<
  R, P extends Promise<R>, T extends ThunkAction<P, RootStateWeb, any, UnknownAction>
>(
  thunk: T,
): R | null {
  const dispatch = useWebDispatch();
  const [result, setResult] = React.useState<R | null>(null);

  React.useEffect(() => {
    dispatch(thunk).then((r) => setResult(r));
  }, [thunk]);

  return result;
}

export default useQuery;
