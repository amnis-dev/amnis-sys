import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootStateWeb } from '../../types.js';

export const useWebSelector: TypedUseSelectorHook<RootStateWeb> = useSelector;

export default useWebSelector;
