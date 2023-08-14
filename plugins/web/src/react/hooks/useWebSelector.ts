import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from '@amnis/state';
import type { RootStateWeb } from '../../types.js';

export const useWebSelector: TypedUseSelectorHook<RootStateWeb & RootState> = useSelector;

export default useWebSelector;
