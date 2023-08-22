import React from 'react';
import {
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  dataActions, localeSlice, noop, userSlice,
} from '@amnis/state';
import { apiCrud } from '@amnis/api';
import { WebContext } from '@amnis/web/react/context';
import type { CrystalizerProps } from '@amnis/web/crystalizer';
import { useUpdateEffect, useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';

const Crystalizer = React.lazy(
  () => import('@amnis/web/crystalizer').then((module) => ({ default: module.Crystalizer })),
);

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export interface WebProviderProps {
  /**
   * Default value for the crystalizer manager.
   */
  manager?: boolean;

  /**
   * Crystalizer dynamic React component.
   */
  ManagerDynamic?: React.LazyExoticComponent<React.FC<CrystalizerProps>>;

  /**
   * Callback when the website is remounted.
   */
  onRemount?: () => void;

  children: React.ReactNode;
}

export const WebProvider: React.FC<WebProviderProps> = ({
  manager: managerProp = false,
  ManagerDynamic = Crystalizer,
  onRemount = noop,
  children,
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

    /**
     * Trigger the remount callback
     */
    onRemount();

    /**
     * Trigger all child components to remount.
     */
    remountSet(!remount);
  }, [language, user?.$id]);

  return (<>
    {manager ? (
      <React.Suspense fallback={null}>
        <ManagerDynamic
          webSelect={webSelect}
          onWebSelect={webSelectSet}
        >
          <WebContext.Provider value={value}>
            <ThemeProvider theme={theme}>
              <Paper key={remount ? 0 : 1} sx={{ minHeight: '100vh' }}>
                {children}
              </Paper>
            </ThemeProvider>
          </WebContext.Provider>
        </ManagerDynamic>
      </React.Suspense>
    ) : (
      <WebContext.Provider value={value}>
        <ThemeProvider theme={theme}>
          <div key={remount ? 0 : 1}>{children}</div>
        </ThemeProvider>
      </WebContext.Provider>
    )}
  </>
  );
};

export default WebProvider;
