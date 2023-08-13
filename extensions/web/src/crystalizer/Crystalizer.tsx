import { createTheme, useTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import type { WebContextIderMap } from '../react/index.js';
import { Highlighter } from './highlighter/index.js';

export interface CrystalizerProps {
  iders: WebContextIderMap;
}

export const Crystalizer: React.FC<CrystalizerProps> = ({ iders }) => {
  const themeWeb = useTheme();

  const [iderSelected, iderSelectedSet] = React.useState<string | null>(null);

  const themeCrystalizer = React.useMemo(() => createTheme({
    palette: {
      mode: themeWeb.palette.mode === 'light' ? 'dark' : 'light',
    },
  }), [themeWeb]);

  const handleHighlighterClick = React.useCallback((id: string) => {
    iderSelectedSet(id);
  }, [iders]);

  const handleHighlighterClose = React.useCallback(() => {
    iderSelectedSet(null);
  }, []);

  return (
    <ThemeProvider theme={themeCrystalizer}>
      <div style={{ poition: 'absolute' }}>
        {Object.keys(iders).map((id) => {
          const [, ref] = iders[id];
          return (
            <Highlighter
              key={id}
              anchor={ref}
              selected={id === iderSelected}
              onClick={() => handleHighlighterClick(id)}
              onClose={handleHighlighterClose}
            >
              <span>Test</span>
            </Highlighter>
          );
        })}
      </div>
    </ThemeProvider>
  );
};
