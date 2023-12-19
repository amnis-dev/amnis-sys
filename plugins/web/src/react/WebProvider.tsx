import React from 'react';
import type { Theme } from '@mui/material';
import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import type { DataSliceGeneric } from '@amnis/state';
import {
  dataActions,
  localeSlice,
  noop,
  userSlice,
} from '@amnis/state';
import { apiCrud, apiSys } from '@amnis/api';
import { BackdropProgress } from '@amnis/web/react/material';
import { Outlet } from '@amnis/web/lib/react-router-dom';
import type { ManagerProps } from '@amnis/web/manager';
import { WebContext } from '@amnis/web/react/context';
import {
  useDebounce, useUpdateEffect, useWebDispatch, useWebSelector,
} from '@amnis/web/react/hooks';

const Manager = React.lazy(
  () => import('@amnis/web/manager').then((module) => ({ default: module.Manager })),
);

const globalScrollBarStyle = <GlobalStyles styles={{
  '*::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '*::-webkit-scrollbar-track': {
    background: '#00000044',
  },
  '*::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    backgroundColor: '#ffffff88',
  },
  '*::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#ffffffaa',
  },
}} />;

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export interface WebProviderProps {
  /**
   * Slices to load into the web application.
   */
  slices?: Record<string, DataSliceGeneric>;

  /**
   * Default value for the manager manager.
   */
  manager?: boolean;

  /**
   * Manager dynamic React component.
   */
  ManagerDynamic?: React.LazyExoticComponent<React.FC<ManagerProps>>;

  /**
   * Callback when the website is remounted.
   */
  onRemount?: () => void;
}

export const WebProvider: React.FC<WebProviderProps> = ({
  slices = {},
  manager: managerProp = false,
  ManagerDynamic = Manager,
  onRemount = noop,
}) => {
  /**
   * Dispatcher
   */
  const dispatch = useWebDispatch();

  /**
   * State data
   */
  const language = useWebSelector(localeSlice.select.activeCode);
  const user = useWebSelector(userSlice.select.active);

  /**
   * Reference of locale keys to request when this component fully mounts or updates.
   */
  const localeKeysCached = React.useRef<Set<string>>(new Set());
  const [localeKeys, localeKeysSet] = React.useState<string[]>([]);
  const localeKeysDebounced = useDebounce(localeKeys, 500);

  const localePush = React.useCallback((key: readonly string[]) => {
    const keyFilter = key.filter((k) => k.startsWith('!') && !localeKeysCached.current.has(k));
    if (!keyFilter.length) return;
    const keyNext = new Set([...localeKeysCached.current, ...keyFilter]);
    localeKeysSet([...keyNext]);
    localeKeysCached.current = keyNext;
  }, [localeKeys]);

  /**
   * Remounts the website when this value toggles.
   */
  const [remount, remountSet] = React.useState(false);

  /**
   * Enables the manager.
   */
  const [manager, managerSet] = React.useState<WebContext['manager']>(managerProp);
  /**
   * Sets the manager panel width.
   */
  const [managerDrawerWidth] = React.useState<number | string>('512px');

  const [managerDrawerOpen, managerDrawerOpenSet] = React.useState(false);

  const [webSelect, webSelectSet] = React.useState<WebContext['webSelect']>();

  const [managerPathname, managerPathnameSet] = React.useState<string | undefined>(undefined);
  const managerLocationPush = React.useCallback((pathname: string) => {
    managerPathnameSet(pathname);
  }, [managerPathnameSet]);

  const value = React.useMemo(() => ({
    slices,
    localePush,
    manager,
    managerSet,
    managerLocationPush,
    webSelect,
    webSelectSet,
  }), [
    slices,
    localePush,
    manager,
    managerSet,
    managerLocationPush,
    webSelect,
    webSelectSet,
  ]);

  /**
   * Effect ensure the manager drawer is closed when the manager is disabled.
   */
  React.useEffect(() => {
    if (!manager) managerDrawerOpenSet(false);
  }, [manager]);

  /**
   * Effect requests the locale key values.
   */
  React.useEffect(() => {
    if (localeKeysDebounced.length) {
      dispatch(apiSys.endpoints.locale.initiate({
        keys: localeKeysDebounced,
      }, { forceRefetch: true }));
      localeKeysSet([]);
    }
  }, [dispatch, localeKeysDebounced, language]);

  /**
   * Reset effect.
   */
  useUpdateEffect(() => {
    /**
     * Clear all but essential data.
     */
    dispatch(dataActions.wipe({
      spare: [
        'agent', 'system', 'api', 'bearer', 'session',
        'website', 'user', 'profile', 'contact', 'language',
        'locale',
      ],
    }));

    /**
     * Clear all cache established by the APIs.
     */
    dispatch(apiCrud.util.resetApiState());
    dispatch(apiSys.util.resetApiState());

    /**
     * Flush state
     */
    localeKeysSet([]);
    localeKeysCached.current = new Set();

    /**
     * Trigger the remount callback
     */
    onRemount();

    /**
     * Trigger all child components to remount.
     */
    remountSet(!remount);
  }, [language, user?.$id]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalScrollBarStyle}

      <WebContext.Provider value={value}>

        {manager ? (
          <React.Suspense
            fallback={(
              <BackdropProgress
                title="Loading Manager"
                subtitle="Please wait..."
              />
            )}
          >
            <ManagerDynamic
              webSelect={webSelect}
              drawerWidth={managerDrawerWidth}
              pathname={managerPathname}
              onWebSelect={webSelectSet}
              onPathnameChange={(pathname) => {
                managerDrawerOpenSet(!!pathname);
                managerPathnameSet(undefined);
              }}
            />
          </React.Suspense>
        ) : null}

        <Box sx= {{
          position: 'relative',
          height: manager ? '100vh' : undefined,
          boxSizing: 'border-box',
          padding: '0',
          marginLeft: 0,
          transition: (theme: Theme) => theme.transitions.create(['padding', 'margin-left'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(manager && { padding: '4px 4px 4px 4px' }),
          ...(managerDrawerOpen && { marginLeft: { xs: 0, lg: managerDrawerWidth } }),
        }}>
          <Box
            sx={{
              bgcolor: '#fff',
              height: manager ? '100%' : undefined,
              overflow: manager ? 'auto' : undefined,
            }}
          >
            <Outlet />
          </Box>
        </Box>

      </WebContext.Provider>

    </ThemeProvider>
  );
};

export default WebProvider;
