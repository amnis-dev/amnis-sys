import type { Theme } from '@mui/material';
import {
  createTheme,
  useTheme,
  ThemeProvider,
  SpeedDial,
  SpeedDialAction,
  Box,
  Backdrop,
  Drawer,
  Stack,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import {
  AdminPanelSettings,
  Build,
  Language,
  PeopleAlt,
  Save,
  Settings,
} from '@mui/icons-material';
import { noop } from '@amnis/state';
import type { WebContext } from '@amnis/web/react/context';
import { Toggles } from './toggles/index.js';
import ModeChip from './modechip/ModeChip.js';

export interface CrystalizerProps {
  /**
   * Sets the web select state.
   */
  webSelect?: WebContext['webSelect'];

  /**
   * Callback when the web select state changes.
   */
  onWebSelect?: WebContext['webSelectSet'];

  children: React.ReactNode;
}

const actions = [
  { icon: <Save />, name: 'Save' },
  { icon: <Build />, name: 'Configuration' },
  { icon: <Language />, name: 'Localization' },
  { icon: <PeopleAlt />, name: 'Accounts' },
  { icon: <AdminPanelSettings />, name: 'Administration' },
];

const drawerWidth = '35%';

export const Crystalizer: React.FC<CrystalizerProps> = ({
  webSelect,
  onWebSelect = noop,
  children,
}) => {
  const themeWeb = useTheme();

  // const [iderSelected, iderSelectedSet] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const themeWebMode = React.useMemo(() => themeWeb.palette.mode, [themeWeb]);

  const themeCrystalizer = React.useMemo(() => createTheme({
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

  /**
   * Get the route from the query parameter cyst.
   */
  const routeLocation = React.useMemo(() => {
    const url = new URL(window.location.href);
    console.log({ url });
    const route = url.searchParams.get('cryst');
    return route;
  }, [window?.location?.href]);

  // const drawerOpen = React.useMemo(() => routeLocation !== null, [routeLocation]);
  const drawerOpen = React.useMemo(() => false, []);

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

  return (
    <Stack direction="row" width="100%" minHeight="100vh">

      {/**
        * Wraps the main content of the web application.
        */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(64deg, rgba(153,102,174,1) 0%, rgba(113,157,255,1) 100%);',
          width: '100%',
          transition: (theme: Theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(drawerOpen && { width: `calc(100% - ${drawerWidth})` }),
        }}
      >
        <Box
          width="100%"
          height="100%"
          flex={1}
          sx={{
            position: 'absolute',
            boxSizing: 'border-box',
            padding: '4px 4px 4px 4px',
          }}
        >
          <Box
            height="100%"
            overflow="scroll"
          >
            {children}
          </Box>
        </Box>
      </Box>

      {/**
        * Begin the crystalizer application for managing the web application.
        */}
      <ThemeProvider theme={themeCrystalizer}>
        <Box sx={{
          width: '0%',
          transition: (theme: Theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(drawerOpen && { width: drawerWidth }),
        }}>
          <Backdrop open={open} onClick={handleClose} />

          {/**
           * The perminant drawer is used to display the crystalizer menu.
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
              label="Data Selection Mode"
              show={webSelect === 'data'}
              onDelete={() => onWebSelect(undefined)}
            />
            <ModeChip
              label="Component Selection Mode"
              show={webSelect === 'component'}
              onDelete={() => onWebSelect(undefined)}
            />

            <Toggles
              webSelect={webSelect}
              onWebSelect={onWebSelect}
            />

            <SpeedDial
              ariaLabel='Management System Actions'
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
              }}
              icon={<Settings />}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  tooltipOpen
                  onClick={handleClose}
                />
              ))}
            </SpeedDial>
          </Box>
        </Box>
      </ThemeProvider>

    </Stack>
  );
};

// background: 'linear-gradient(64deg, rgba(153,102,174,1) 0%, rgba(113,157,255,1) 100%);',

export default Crystalizer;
