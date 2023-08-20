import {
  createTheme, useTheme, ThemeProvider, SpeedDial, SpeedDialAction, Box, Backdrop, Drawer,
} from '@mui/material';
import React from 'react';
import {
  AdminPanelSettings, Build, Language, PeopleAlt, Save, Settings,
} from '@mui/icons-material';
import type { WebContextIderMap } from '@amnis/web/react';

export interface CrystalizerProps {
  iders: WebContextIderMap;
}

const actions = [
  { icon: <Save />, name: 'Save' },
  { icon: <Build />, name: 'Configuration' },
  { icon: <Language />, name: 'Localization' },
  { icon: <PeopleAlt />, name: 'Accounts' },
  { icon: <AdminPanelSettings />, name: 'Administration' },
];

export const Crystalizer: React.FC<CrystalizerProps> = () => {
  const themeWeb = useTheme();

  // const [iderSelected, iderSelectedSet] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const themeCrystalizer = React.useMemo(() => createTheme({
    palette: {
      mode: themeWeb.palette.mode === 'light' ? 'dark' : 'light',
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

  return (
    <ThemeProvider theme={themeCrystalizer}>
      <Box style={{
        poition: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      }}>
        <Backdrop open={open} onClick={handleClose} />
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
      <Drawer
        open={routeLocation !== null}
        container={container}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: '100%',
        }}
      >
        <Box>&nbsp;</Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Crystalizer;
