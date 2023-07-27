import type { GrantScope } from './data/grant/grant.types.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StateKey<K = any> = string & Record<never, K>;

/**
 * An ambiguous state.
 */
export type State<ReducerState = any> = Record<string, ReducerState>;

/**
 * A stateful mapping of data access scopes.
 */
export type StateScope = State<GrantScope>;
