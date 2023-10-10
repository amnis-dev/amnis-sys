import React from 'react';
import { noop } from '@amnis/state';
import { useDebounce } from './useDebounce.js';

type UseFormCallback<T> = (data: T) => void;

export function useFormState<T>(
  data?: T,
  callback: UseFormCallback<T> = noop,
  delay = 320,
): [T | undefined, (value: T) => void] {
  const [dataForm, dataFormSet] = React.useState(data);
  const [isFormUpdate, isFormUpdateSet] = React.useState(false);

  const dataFormSetWrapper = React.useCallback((value: T) => {
    isFormUpdateSet(true);
    dataFormSet(value);
  }, [isFormUpdateSet, dataFormSet]);

  const dataFormDebounced = useDebounce(dataForm, delay);
  const dataFormDebouncedValues = React.useMemo(
    () => Object.values(dataFormDebounced || {}),
    [dataFormDebounced],
  );

  React.useEffect(() => {
    isFormUpdateSet(false);
    dataFormSet(data);
  }, [data]);

  React.useEffect(() => {
    if (isFormUpdate && dataFormDebounced) {
      callback(dataFormDebounced);
    }
  }, [
    ...dataFormDebouncedValues,
    dataFormDebouncedValues.length,
  ]);

  return [dataForm, dataFormSetWrapper];
}

export default useFormState;
