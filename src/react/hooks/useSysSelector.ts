import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from '@amnis/state';

export const useSysSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useSysSelector;
