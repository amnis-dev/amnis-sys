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
import { noop } from '@amnis/state';
import type { WebContext } from '@amnis/web/react/context';
import { Toggles } from './Toggles/index.js';
import { ModeChip } from './ModeChip/index.js';
import { ManagerContext } from './ManagerContext.js';
import { ManagerSpeedDial } from './ManagerSpeedDial/index.js';
import { LocaleButton } from './LocaleButton/index.js';

export interface ManagerProps {
  /**
   * Sets the web select state.
   */
  webSelect?: WebContext['webSelect'];

  /**
   * Callback when the web select state changes.
   */
  onWebSelect?: WebContext['webSelectSet'];
}

const drawerWidth = '35%';

export const Manager: React.FC<ManagerProps> = ({
  webSelect,
  onWebSelect = noop,
}) => {
  /**
   * Gets the website-to-manage theme.
   */
  const themeWeb = useTheme();

  const [localeCode, localeCodeSet] = React.useState<ManagerContext['localeCode']>('en');
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
        divider: grey[600],
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

  const container = React.useCallback(() => window.document.body, [window]);

  // const drawerOpen = React.useMemo(() => routeLocation !== null, [routeLocation]);
  const drawerOpen = React.useMemo(() => false, []);

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
    localeLoading,
    localeCode,
    localeCodeSet,
    locale,
  }), [
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
          minHeight="100vh"
          sx={{
            position: 'absolute',
            background: 'linear-gradient(64deg, rgba(153,102,174,1) 0%, rgba(113,157,255,1) 100%);',
            top: 0,
            left: 0,
          }}
        >

          <Box sx={{
            width: '0%',
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
                '& .MuiDrawer-paper': {
                  transition: 'width 0.5s ease-in-out',
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }}
            >
              <Box>&nbsp;</Box>
            </Drawer>
            {/* <Drawer
            open={drawerOpen}
            container={container}
            variant="temporary"
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Box width={450}>&nbsp;</Box>
          </Drawer> */}

            <Box style={{
              poition: 'fixed', top: 0, left: 0,
            }}>

              <ModeChip
                label={locale?.['web:manager:state_data_select_chip'] ?? '...'}
                show={webSelect === 'data'}
                onDelete={() => onWebSelect(undefined)}
              />
              <ModeChip
                label={locale?.['web:manager:state_component_select_chip'] ?? '...'}
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
          </Box>
        </Stack>

      </ManagerContext.Provider>
    </ThemeProvider>
  );
};

// background: 'linear-gradient(64deg, rgba(153,102,174,1) 0%, rgba(113,157,255,1) 100%);',

export default Manager;