import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { set as stateSet } from '@amnis/state/set';
import { set as apiSet } from '../../../set/set.js';

const reducers = combineReducers({
  ...stateSet.reducers,
  ...apiSet.reducers,
});

export const clientStore = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat([...stateSet.middleware, ...apiSet.middleware])
  ),
});

export default clientStore;
