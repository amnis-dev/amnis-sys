import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { appGet, appKey } from './app.js';
import type { App, AppSystems } from './app.types.js';
import type { State } from '../../state.types.js';
import { localStorage } from '../../localstorage.js';

/**
 * Initialized app state with meta information.
 */
const initialState: App = appGet();

/**
 * RTK App Slice
 */
const slice = createSlice({
  name: appKey,
  initialState,
  reducers: {
    /**
     * Defines all possibly known systems on the network.
     */
    systemsSet: (
      state,
      action: PayloadAction<{name: string, url: string}[]>,
    ) => {
      action.payload.forEach(({ name, url }, index) => {
        state.systems[name] = url;
        if (index === 0) {
          if (!state.systemDefault || !state.systems[state.systemDefault]) {
            state.systemDefault = name;
          }
        }
      });
    },

    /**
     * Clears all systems.
     */
    systemsClear: (state) => {
      state.systems = {};
      state.systemDefault = undefined;
    },

    /**
     * Defines a possible system on the network.
     */
    systemAdd: (
      state,
      action: PayloadAction<{
        name: string,
        url: string,
        setDefault?: boolean
      }>,
    ) => {
      const { name, url, setDefault } = action.payload;
      state.systems[name] = url;

      if (!state.systemDefault || setDefault === true) {
        state.systemDefault = name;
      }
    },

    /**
     * Removes a possible system on the network.
     */
    systemRemove: (state, action: PayloadAction<keyof AppSystems>) => {
      if (state.systemDefault === action.payload) {
        state.systemDefault = undefined;
      }

      if (!state.systems[action.payload]) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...systems } = state.systems;
      state.systems = systems;
    },

    /**
     * Sets the default system.
     */
    systemDefaultSet: (state, action: PayloadAction<keyof AppSystems>) => {
      if (!state.systems[action.payload]) {
        return;
      }
      state.systemDefault = action.payload;
    },

    /**
     * Navigate to a route location.
     */
    navigate: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    /**
     * Match any app action and save the state to local storage.
     */
    builder.addMatcher(
      (action) => action.type.startsWith(`${appKey}/`),
      (state) => {
        localStorage().setItem(`state-${appKey}`, JSON.stringify(state));
      },
    );
  },
});

/**
 * App redux reducer.
 */
const { reducer } = slice;

/**
 * App redux actions.
 */
const { actions: action } = slice;

/**
 * App redux selectors.
 */
const select = {
  /**
   * Selects known application systems.
   */
  systems: (state: State) => {
    const appSlice = state[appKey] as App;
    return appSlice.systems;
  },

  /**
   * Selects the default system.
   */
  systemDefault: (state: State) => {
    const appSlice = state[appKey] as App;
    const { systemDefault } = appSlice;
    if (!systemDefault) {
      return undefined;
    }
    return systemDefault;
  },

  /**
   * Selects the current route location.
   */
  routeLocation: (state: State) => {
    const appSlice = state[appKey] as App;
    return appSlice.location;
  },
};

export const appSlice = {
  key: appKey as typeof appKey,
  name: appKey as typeof appKey,
  initialState,
  getInitialState: () => initialState,
  action,
  select,
  reducer,
};

/**
 * Export the slice as default.
 */
export default appSlice;
