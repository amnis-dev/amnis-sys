import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootStateWeb } from '../../types.js';
import type { RootState } from '@amnis/state';

export const useWebSelector: TypedUseSelectorHook<RootStateWeb & RootState> = useSelector;

export default useWebSelector;
