import React from 'react';
import { Close } from '@mui/icons-material';
import {
  Box, Breadcrumbs, Divider, IconButton, LinearProgress, Stack, Typography,
} from '@mui/material';
import { ManagerContext } from '../ManagerContext.js';

const PanelAdministration = React.lazy(() => import('../PanelAdministration/PanelAdministration.js'));

export const Panel: React.FC = () => {
  const { pathname, pathnameSet } = React.useContext(ManagerContext);

  const crumbs = React.useMemo(() => ['Manager', ...(pathname?.split('/').slice(1) ?? [])], [pathname]);

  const handleClose = React.useCallback(() => {
    pathnameSet(null);
  }, [pathnameSet]);

  return (
    <Stack direction="column">
      <Stack direction="row" alignItems="center">
        <Box flex={1} m={1}>
          <Breadcrumbs>
            {crumbs.map((crumb, index) => (
              <Typography
                key={crumb}
                variant="body2"
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => pathnameSet(crumbs.slice(0, index + 1).join('/'))}
              >
                {crumb}
              </Typography>
            ))}
          </Breadcrumbs>
        </Box>
        <Box m={1}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </Stack>
      <Divider />
      <Box>
        {(() => {
          console.log(pathname);
          switch (pathname) {
            case '/Administration':
              return (
                <React.Suspense fallback={<LinearProgress />}>
                  <Box p={1}><PanelAdministration /></Box>
                </React.Suspense>
              );
            default:
              return <LinearProgress />;
          }
        })()}
      </Box>
    </Stack>
  );
};

export default Panel;
