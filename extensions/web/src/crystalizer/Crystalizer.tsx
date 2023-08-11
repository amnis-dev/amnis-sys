import { createTheme, useTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import type { WebContextIderMap } from '../react/WebContext.js';
import { Highlighter } from './highlighter/index.js';

export interface CrystalizerProps {
  iders: WebContextIderMap;
}

export const Crystalizer: React.FC<CrystalizerProps> = ({ iders }) => {
  const themeWeb = useTheme();

  const themeCrystalizer = React.useMemo(() => createTheme({
    palette: {
      mode: themeWeb.palette.mode === 'light' ? 'dark' : 'light',
    },
  }), [themeWeb]);

  // console.log({ iders });

  return (
    <ThemeProvider theme={themeCrystalizer}>
      <div style={{ poition: 'absolute' }}>
        {Object.keys(iders).map((key) => {
          const [, ref] = iders[key];
          return <Highlighter key={key} anchor={ref} />;
        })}
      </div>
    </ThemeProvider>
  );
};
