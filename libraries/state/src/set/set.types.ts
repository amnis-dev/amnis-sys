import type { Reducer } from '@reduxjs/toolkit';

export type ExtractPropRootState<Type> = Type extends Reducer<infer X> ? X : never;

export type ExtractRootState<Type> = {
  [Key in keyof Type]: ExtractPropRootState<Type[Key]>;
};
