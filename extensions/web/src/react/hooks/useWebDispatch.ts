import type { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import type { RootStateWeb } from '../../types.js';

export const useWebDispatch = () => useDispatch<ThunkDispatch<RootStateWeb, undefined, UnknownAction> & Dispatch>();

export default useWebDispatch;