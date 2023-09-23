import React from 'react';
import type { Theme } from '@mui/material';
import {
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
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
import { useUpdateEffect, useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';

const Manager = React.lazy(
  () => import('@amnis/web/manager').then((module) => ({ default: module.Manager })),
);

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export interface WebProviderProps {
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

  const value = React.useMemo(() => ({
    manager,
    managerSet,
    webSelect,
    webSelectSet,
  }), [
    manager,
    managerSet,
    webSelect,
    webSelectSet,
  ]);

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
      ],
    }));

    /**
     * Clear all cache established by the APIs.
     */
    dispatch(apiCrud.util.resetApiState());
    dispatch(apiSys.util.resetApiState());

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
            onWebSelect={webSelectSet}
            onPathnameChange={(pathname) => managerDrawerOpenSet(!!pathname)}
          />
        </React.Suspense>
      ) : null}

      <WebContext.Provider value={value}>

        <Box sx= {{
          position: 'relative',
          height: '100vh',
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
            key={remount ? 0 : 1}
            sx={{
              bgcolor: '#fff',
              height: '100%',
              overflow: 'scroll',
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
