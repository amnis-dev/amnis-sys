import {
  createTheme, useTheme, ThemeProvider, SpeedDial, SpeedDialAction, Box, Backdrop,
} from '@mui/material';
import React from 'react';
import {
  AdminPanelSettings, Language, PeopleAlt, Save, Settings as SettingsIcon,
} from '@mui/icons-material';
import type { WebContextIderMap } from '../react/index.js';

export interface CrystalizerProps {
  iders: WebContextIderMap;
}

const actions = [
  { icon: <Save />, name: 'Save' },
  { icon: <Language />, name: 'Languages' },
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
          icon={<SettingsIcon />}
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
    </ThemeProvider>
  );
};

export default Crystalizer;
