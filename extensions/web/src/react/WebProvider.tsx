import React from 'react';
import { ThemeProvider, Typography, createTheme } from '@mui/material';
import type { WebContextIder, WebContextIderMap } from './WebContext.js';
import { WebContext } from './WebContext.js';
import type { CrystalizerProps } from '../crystalizer/Crystalizer.js';

const Crystalizer = React.lazy(
  () => import('@amnis/web/crystalizer').then((module) => ({ default: module.Crystalizer })),
);

const theme = createTheme({});

export interface WebProviderProps {
  /**
   * Default value for the crystalizer manager.
   */
  crystalizer?: boolean;

  /**
   * Crystalizer dynamic React component.
   */
  CrystalizerDynamic?: React.LazyExoticComponent<React.FC<CrystalizerProps>>;

  children: React.ReactNode;
}

export const WebProvider: React.FC<WebProviderProps> = ({
  crystalizer: crystalizerProp = false,
  CrystalizerDynamic = Crystalizer,
  children,
}) => {
  const [crystalizer, crystalizerSet] = React.useState(crystalizerProp);
  const [iders, idersSet] = React.useState<WebContextIderMap>({});

  const idersAdd = React.useCallback((id: string, ref: WebContextIder) => {
    idersSet((iders) => ({
      ...iders,
      [id]: ref,
    }));
  }, [idersSet, iders]);

  const idersRemove = React.useCallback((id: string) => {
    idersSet((iders) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = iders;
      return rest;
    });
  }, [idersSet, iders]);

  const value = React.useMemo(() => ({
    crystalizer,
    crystalizerSet,
    iders,
    idersAdd,
    idersRemove,
  }), [
    crystalizer,
    crystalizerSet,
    iders,
    idersAdd,
    idersRemove,
  ]);

  return (
    <WebContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <div
          style={crystalizer ? {
            border: '2px solid #88F',
          } : undefined}
        >
          {crystalizer ? (
            <div
              style={{
                width: '100%',
                backgroundColor: '#88F',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption">Management Mode</Typography>
            </div>
          ) : null}
          {children}
        </div>
        {crystalizer ? (
          <React.Suspense fallback={null}>
            <CrystalizerDynamic iders={iders} />
          </React.Suspense>
        ) : null}
      </ThemeProvider>
    </WebContext.Provider>
  );
};
