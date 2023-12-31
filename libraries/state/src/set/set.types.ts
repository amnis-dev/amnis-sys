import type { Reducer } from '@amnis/state/rtk';
import type { reducers } from './reducers.js';

export type ExtractPropRootState<Type> = Type extends Reducer<infer X> ? X : never;

export type ExtractRootState<Type> = {
  [Key in keyof Type]: ExtractPropRootState<Type[Key]>;
};

export type StateRoot = ExtractRootState<typeof reducers>;
