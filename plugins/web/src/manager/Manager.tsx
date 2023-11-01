import type { Theme } from '@mui/material';
import {
  createTheme,
  useTheme,
  ThemeProvider,
  Box,
  Drawer,
  Stack,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { localeSlice, noop } from '@amnis/state';
import type { WebContext } from '@amnis/web/react/context';
import { useSearchParams } from '@amnis/web/lib/react-router-dom';
import { useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';
import { Toggles } from './Toggles/index.js';
import { ModeChip } from './ModeChip/index.js';
import { ManagerContext, managerContextDefault } from './ManagerContext.js';
import { ManagerSpeedDial } from './ManagerSpeedDial/index.js';
import { LocaleButton } from './LocaleButton/index.js';
import { Panel } from './Panel/index.js';
import type { ManagerLocaleCode } from './locale/manager.locale.types.js';

export interface ManagerProps {
  /**
   * Push a custom location path to the manager.
   */
  pathname?: string;

  /**
   * Sets the web select state.
   */
  webSelect?: WebContext['webSelect'];

  /**
   * The width of the manager panel drawer.
   *
   * @default '35%'
   */
  drawerWidth?: string | number;

  /**
   * Callback when the web select state changes.
   */
  onWebSelect?: WebContext['webSelectSet'];

  /**
   * Callback when the manager's pathname changes.
   */
  onPathnameChange?: (pathname: string | null) => void;
}

export const Manager: React.FC<ManagerProps> = ({
  pathname,
  webSelect,
  drawerWidth = '35%',
  onWebSelect = noop,
  onPathnameChange = noop,
}) => {
  /**
   * Gets the website-to-manage theme.
   */
  const themeWeb = useTheme();

  const dispatch = useWebDispatch();

  const localeCode = useWebSelector(localeSlice.select.activeCode) as ManagerLocaleCode;

  const localeCodeSet = React.useCallback((code: ManagerLocaleCode) => {
    dispatch(localeSlice.action.codeSet(code));
  }, []);

  /**
   * Get the current navgation state.
   */
  const [searchParams, searchParamsSet] = useSearchParams();
  const searchParamManager = React.useMemo(() => searchParams.get('manager'), [searchParams]);

  const [location, locationSet] = React.useState<ManagerContext['location']>({
    url: undefined,
    path: null,
    hash: null,
    crumbs: [],
    page: null,
  });

  const locationConfigure = React.useCallback((fullPathname?: string) => {
    console.log(fullPathname);
    const result: ManagerContext['location'] = {
      url: undefined,
      path: null,
      hash: null,
      crumbs: [],
      page: null,
    };

    if (!fullPathname || fullPathname.length === 0) {
      searchParams.delete('manager');
      searchParamsSet(searchParams);
      locationSet(result);
      return;
    }
    const parts = fullPathname.split('#');

    result.url = fullPathname;
    result.path = parts[0] || null;
    result.hash = parts[1] || null;
    result.crumbs = result.path?.slice(1).split('/').filter((c) => c.length > 0) || [];
    result.page = result.crumbs.slice(-1)[0] || null;

    locationSet(result);
    searchParams.set('manager', fullPathname);
    searchParamsSet(searchParams);
  }, [locationSet, searchParams, searchParamsSet]);

  React.useEffect(() => {
    if (searchParamManager) {
      locationConfigure(searchParamManager);
    }
  }, []);

  React.useEffect(() => {
    if (location.url && location.url !== searchParamManager) {
      searchParams.set('manager', location.url);
      searchParamsSet(searchParams);
    }
  }, [searchParamManager]);

  React.useEffect(() => {
    if (pathname) {
      locationConfigure(pathname);
    }
  }, [pathname]);

  const locationPush = React.useCallback((pathname: string | null) => {
    if (!pathname) {
      locationConfigure();
      return;
    }

    const charZero = pathname.charAt(0);

    console.log({ pathname });
    if (charZero === '/') {
      locationConfigure(pathname);
    } else {
      locationConfigure(`${location.path}/${pathname}`);
    }
  }, [location.path, locationConfigure, searchParamsSet]);

  const [locale, localeSet] = React.useState<ManagerContext['locale']>();
  const [localeLoading, localeLoadingSet] = React.useState(true);

  /**
   * Memorize the website-to-manage theme palette mode (light or dark).
   */
  const themeWebMode = React.useMemo(() => themeWeb.palette.mode, [themeWeb]);

  /**
   * Create the theme for the manager application.
   */
  const themeManager = React.useMemo(() => createTheme({
    palette: {
      mode: themeWebMode === 'light' ? 'dark' : 'light',
      ...(themeWebMode === 'light' ? {
        divider: grey[700],
        background: {
          default: grey[800],
          paper: grey[900],
        },
      } : {
        divider: grey[700],
        background: {
          paper: grey[100],
        },
      }),
    },
  }), [themeWeb]);

  const drawerOpen = React.useMemo(() => location.path !== null, [location.path]);

  const container = React.useCallback(() => window.document.body, [window]);

  React.useEffect(() => {
    onPathnameChange(location.path);
  }, [location.path]);

  /**
   * Lazy load the locale data.
   */
  React.useEffect(() => {
    localeLoadingSet(true);
    (async () => {
      try {
        switch (localeCode) {
          case 'en':
            localeSet((await import('@amnis/web/manager/locale/en')).managerLocale);
            break;
          case 'de':
            localeSet((await import('@amnis/web/manager/locale/de')).managerLocale);
            break;
          default:
            localeSet((await import('@amnis/web/manager/locale/en')).managerLocale);
        }
      } catch (error) {
        console.error(error);
      }
      localeLoadingSet(false);
    })();
  }, [localeCode]);

  /**
   * Trigger a window resize event to help the web application
   * to reconsider its layout.
   */
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [drawerOpen]);

  /**
   * Setup the manager context.
   */
  const managerContext = React.useMemo<ManagerContext>(() => ({
    ...managerContextDefault,
    location,
    locationPush,
    localeLoading,
    localeCode,
    localeCodeSet,
    locale,
  }), [
    location,
    locationPush,
    localeLoading,
    localeCode,
    locale,
  ]);

  return (
    <ThemeProvider theme={themeManager}>
      <ManagerContext.Provider value={managerContext}>

        <Stack
          direction="row"
          width="100%"
          height="100vh"
          sx={{
            position: 'absolute',
            background: 'linear-gradient(64deg, rgba(153,102,174,1) 0%, rgba(113,157,255,1) 100%);',
            top: 0,
            left: 0,
          }}
        >

          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            zIndex: 100,
            transition: (theme: Theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(drawerOpen && { width: drawerWidth }),
          }}>

            {/**
           * The perminant drawer is used to display the manager menu.
           */}
            <Drawer
              open={drawerOpen}
              variant="persistent"
              sx={{
                display: { xs: 'none', lg: 'flex' },
                zIndex: 9999,
                '& .MuiDrawer-paper': {
                  transition: 'width 0.5s ease-in-out',
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  bgcolor: 'background.paper',
                },
              }}
            >
              <Panel />
            </Drawer>
            <Drawer
              open={drawerOpen}
              container={container}
              variant="temporary"
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                zIndex: 9999,
                '& .MuiDrawer-paper': {
                  width: '90%',
                  bgcolor: 'background.paper',
                  backgroundImage: 'none',
                },
                display: { xs: 'flex', lg: 'none' },
              }}
            >
              <Panel />
            </Drawer>
          </Box>

          <Box sx={{
            position: 'relative',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            marginLeft: 0,
            transition: (theme: Theme) => theme.transitions.create('margin-left', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(drawerOpen && { marginLeft: { xs: 0, lg: drawerWidth } }),
          }}>

            <ModeChip
              label={locale?.['manager.state_data_select_chip'] ?? '...'}
              show={webSelect === 'data'}
              onDelete={() => onWebSelect(undefined)}
            />
            <ModeChip
              label={locale?.['manager.state_component_select_chip'] ?? '...'}
              show={webSelect === 'component'}
              onDelete={() => onWebSelect(undefined)}
            />

            <Toggles
              webSelect={webSelect}
              onWebSelect={onWebSelect}
            />

            <LocaleButton />

            <ManagerSpeedDial />
          </Box>

        </Stack>

      </ManagerContext.Provider>
    </ThemeProvider>
  );
};

// background: 'linear-gradient(64deg, rgba(153,102,174,1) 0%, rgba(113,157,255,1) 100%);',

export default Manager;
