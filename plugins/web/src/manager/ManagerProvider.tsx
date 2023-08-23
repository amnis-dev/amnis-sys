import { ThemeProvider, createTheme, useTheme } from '@mui/material';
import React from 'react';

export interface ManagerProviderProps {
  children?: React.ReactNode;
}

export const ManagerProvider: React.FC<ManagerProviderProps> = ({
  children,
}) => {
  const themeWeb = useTheme();

  const themeManager = React.useMemo(() => createTheme({
    palette: {
      mode: themeWeb.palette.mode === 'light' ? 'dark' : 'light',
    },
  }), [themeWeb]);

  return (
    <ThemeProvider theme={themeManager}>
      {children}
    </ThemeProvider>
  );
};

export default ManagerProvider;
