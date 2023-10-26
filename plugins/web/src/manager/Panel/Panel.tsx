import React from 'react';
import { ArrowBack, Close, Home } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { stateSelect } from '@amnis/state';
import { useWebSelector } from '@amnis/web/react/hooks';
import { ManagerContext } from '../ManagerContext.js';

const PanelAdministration = React.lazy(() => import('../PanelAdministration/PanelAdministration.js'));
const PanelSave = React.lazy(() => import('../PanelSave/PanelSave.js'));
const PanelDifference = React.lazy(() => import('../PanelDifference/PanelDifference.js'));

export const Panel: React.FC = () => {
  const {
    location, locationPush, locale,
  } = React.useContext(ManagerContext);

  const differenceCount = useWebSelector(stateSelect.entityDifferenceCount);

  const handleClose = React.useCallback(() => {
    locationPush(null);
  }, [locationPush]);

  const RouteComponent = React.useMemo(() => {
    switch (location.page) {
      case 'Administration':
        return (
          <PanelAdministration />
        );
      case 'Save':
        return (
          <PanelSave />
        );
      case 'Difference':
        return (
          <PanelDifference />
        );
      case null:
        return (
          <Stack gap={2}>
            <Box>
              <Button
                variant="contained"
                fullWidth
                disabled={differenceCount <= 0}
                color="warning"
                onClick={() => locationPush('/Save')}
              >
                {differenceCount <= 0 ? 'No unsaved changes found' : `Save Changes (${differenceCount})`}
              </Button>
            </Box>
            <Card>
              <CardActionArea
                onClick={() => locationPush('/Administration')}
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
      default:
        return (
          <Typography>
            {locale?.['manager.panel.not_found'] ?? 'Not Found'}
          </Typography>
        );
    }
  }, [location.page, locale, differenceCount]);

  const handleHomeClick = React.useCallback(() => {
    locationPush('/');
  }, [locationPush]);

  const handleBackClick = React.useCallback(() => {
    const patnameNext = `/${location.crumbs.slice(0, -1).join('/')}`;
    locationPush(patnameNext);
  }, [location.crumbs, locationPush]);

  return (
    <Stack direction="column">
      <Stack direction="row" alignItems="center" gap={1}>
        <IconButton onClick={handleBackClick} disabled={location.crumbs.length <= 0}>
          <ArrowBack />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton onClick={handleHomeClick}>
          <Home />
        </IconButton>
        <Box flex={1} sx={{ overflowX: 'scroll', overflowY: 'hidden' }} >
          <Breadcrumbs sx={{
            '& > .MuiBreadcrumbs-ol': {
              flexWrap: 'nowrap',
            },
          }}>
            {location.crumbs.map((crumb, index) => (
              <Typography
                key={crumb}
                variant="body2"
                sx={{ textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => locationPush(`/${location.crumbs.slice(0, index + 1).join('/')}`)}
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
