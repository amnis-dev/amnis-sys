import { ThemeProvider, createTheme, useTheme } from '@mui/material';
import React from 'react';

export interface CrystalizerProviderProps {
  children?: React.ReactNode;
}

export const CrystalizerProvider: React.FC<CrystalizerProviderProps> = ({
  children,
}) => {
  const themeWeb = useTheme();

  const themeCrystalizer = React.useMemo(() => createTheme({
    palette: {
      mode: themeWeb.palette.mode === 'light' ? 'dark' : 'light',
    },
  }), [themeWeb]);

  return (
    <ThemeProvider theme={themeCrystalizer}>
      {children}
    </ThemeProvider>
  );
};

export default CrystalizerProvider;
