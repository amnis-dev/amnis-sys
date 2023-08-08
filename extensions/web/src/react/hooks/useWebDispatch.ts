import type { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import type { RootStateWeb } from '../../types.js';
import { RootState } from '@amnis/state';

export const useWebDispatch = () => useDispatch<ThunkDispatch<RootStateWeb & RootState, undefined, UnknownAction> & Dispatch>();

export default useWebDispatch;