import React from 'react';
import {
  ArrowBack, Close, Home,
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
} from '@mui/material';
import { stateSelect } from '@amnis/state';
import { useWebSelector } from '@amnis/web/react/hooks';
import { Text } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';
import { PanelIndex } from './PanelIndex.js';

const PanelContent: Record<string, React.LazyExoticComponent<React.FC>> = {
  Administration: React.lazy(() => import('../PanelAdministration/PanelAdministration.js')),
  Accounts: React.lazy(() => import('../PanelAccounts/PanelAccounts.js')),
  Difference: React.lazy(() => import('../PanelDifference/PanelDifference.js')),
  Edit: React.lazy(() => import('../PanelEdit/PanelEdit.js')),
  Localization: React.lazy(() => import('../PanelLocalization/PanelLocalization.js')),
  Save: React.lazy(() => import('../PanelSave/PanelSave.js')),
  Translate: React.lazy(() => import('../PanelTranslate/PanelTranslate.js')),
};

export const Panel: React.FC = () => {
  const {
    location, locationPush, locale,
  } = React.useContext(ManagerContext);

  const differenceCount = useWebSelector(stateSelect.entityDifferenceCount);

  const handleClose = React.useCallback(() => {
    locationPush(null);
  }, [locationPush]);

  const RouteComponent = React.useMemo(() => {
    if (location.page === null) {
      return <PanelIndex />;
    }
    if (!PanelContent[location.page]) {
      return (
        <Text>
          {locale?.['manager.panel.not_found'] ?? 'Not Found'}
        </Text>
      );
    }

    return React.createElement(PanelContent[location.page]);
  }, [location.page, locale, differenceCount]);

  const handleHomeClick = React.useCallback(() => {
    locationPush('/');
  }, [locationPush]);

  const handleBackClick = React.useCallback(() => {
    const patnameNext = `/${location.crumbs.slice(0, -1).join('/')}`;
    locationPush(patnameNext);
  }, [location.crumbs, locationPush]);

  return (
    <Stack direction="column" sx={{ height: '100%' }}>
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
              <Text
                key={crumb}
                variant="body2"
                sx={{ textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => locationPush(`/${location.crumbs.slice(0, index + 1).join('/')}`)}
              >
                {locale?.[`manager.route.${crumb.toLowerCase()}`] ?? crumb}
              </Text>
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
      <Box flex={1} p={1} sx={{ overflow: 'scroll' }}>
        <React.Suspense fallback={<LinearProgress />}>
          {RouteComponent}
        </React.Suspense>
      </Box>
    </Stack>
  );
};

export default Panel;
