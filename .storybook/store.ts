import { combineReducers, configureStore } from '@amnis/state/rtk';
import { set as stateSet } from '@amnis/state/set';
// import { webSet } from '@amnis/web/set';

export const store = configureStore({
  reducer: combineReducers({
    ...stateSet.reducers,
    // ...webSet.reducers,
  }),
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat([...stateSet.middleware ])
  ),
});

export default store;