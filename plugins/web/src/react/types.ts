import type { IoOutput } from '@amnis/state';

export interface QueryResult<T> {
  currentData?: IoOutput<T>['json'];
  data?: IoOutput<T>['json'];
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  refetch: () => void;
  status: 'fulfilled' | 'idle' | 'loading' | 'rejected';
}
