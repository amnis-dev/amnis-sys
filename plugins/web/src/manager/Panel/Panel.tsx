import React from 'react';
import { Close } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { ManagerContext } from '../ManagerContext.js';

const PanelAdministration = React.lazy(() => import('../PanelAdministration/PanelAdministration.js'));
const PanelSave = React.lazy(() => import('../PanelSave/PanelSave.js'));

export const Panel: React.FC = () => {
  const { pathname, pathnameSet, locale } = React.useContext(ManagerContext);

  const crumbs = React.useMemo(() => ['Manager', ...(pathname?.split('/').slice(1) ?? [])], [pathname]);

  const handleClose = React.useCallback(() => {
    pathnameSet(null);
  }, [pathnameSet]);

  const RouteComponent = React.useMemo(() => {
    switch (pathname) {
      case '/Administration':
        return (
          <PanelAdministration />
        );
      case '/Save':
        return (
          <PanelSave />
        );
      default:
        return (
          <Stack gap={2}>
            <Box pb={3}>
              <Typography variant="h6" component="div">
                {locale?.['manager.panel.welcome']}
              </Typography>
              <Typography variant="body2">
                {locale?.['manager.panel.welcome.description']}
              </Typography>
            </Box>
            <Card>
              <CardActionArea
                onClick={() => pathnameSet('/Administration')}
              >
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {locale?.['manager.route.administration'] ?? 'Administration'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locale?.['manager.route.administration.description'] ?? 'Administration'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Stack>
        );
    }
  }, [pathname, locale]);

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
                onClick={() => pathnameSet(`/${crumbs.slice(1, index + 1).join('/')}`)}
              >
                {locale?.[`manager.route.${crumb.toLowerCase()}`] ?? crumb}
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
      <Box p={1}>
        <React.Suspense fallback={<LinearProgress />}>
          {RouteComponent}
        </React.Suspense>
      </Box>
    </Stack>
  );
};

export default Panel;
