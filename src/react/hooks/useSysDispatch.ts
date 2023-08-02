import type { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import type { RootState } from '@amnis/state';

export const useSysDispatch = () => useDispatch<
ThunkDispatch<RootState, undefined, UnknownAction> & Dispatch
>();

export default useSysDispatch;
