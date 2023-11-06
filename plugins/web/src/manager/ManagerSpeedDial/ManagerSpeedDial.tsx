import React from 'react';
import {
  Backdrop, Badge, SpeedDial, SpeedDialAction,
} from '@mui/material';
import {
  AdminPanelSettings, Build, Language, PeopleAlt, Save, Settings,
} from '@mui/icons-material';
import { stateSelect } from '@amnis/state';
import { useWebSelector } from '@amnis/web/react/hooks';
import { Text } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';

export const ManagerSpeedDial: React.FC = () => {
  const [open, openSet] = React.useState(false);

  // const handleOpen = React.useCallback(() => openSet(true), [openSet]);
  const handleClose = React.useCallback(() => openSet(false), [openSet]);

  const stagedCount = useWebSelector(stateSelect.stagedCount);
  const { locale, locationPush } = React.useContext(ManagerContext);

  const handleNavigate = React.useCallback((path: string) => {
    locationPush(path);
  }, [locationPush]);

  /**
   * Create speeddial actions.
   */
  const actions = React.useMemo(() => [
    {
      id: 'save',
      icon: stagedCount > 0 ? (
        <Badge
          badgeContent={stagedCount}
          color='warning'
        >
          <Save />
        </Badge>
      ) : <Save />,
      name: locale?.['manager.speeddial.save'] ?? '...',
      onClick: () => handleNavigate('/Save'),
    },
    {
      id: 'Manager',
      icon: <Build />,
      name: locale?.['manager.speeddial.manager'] ?? '...',
      onClick: () => handleNavigate('/'),
    },
    {
      id: 'localization',
      icon: <Language />,
      name: locale?.['manager.speeddial.localization'] ?? '...',
      onClick: () => handleNavigate('/Localization'),
    },
    {
      id: 'accounts',
      icon: <PeopleAlt />,
      name: locale?.['manager.speeddial.accounts'] ?? '...',
      onClick: () => handleNavigate('/Accounts'),
    },
    {
      id: 'administration',
      icon: <AdminPanelSettings />,
      name: locale?.['manager.speeddial.administration'] ?? '...',
      onClick: () => handleNavigate('/Administration'),
    },
  ], [locale, stagedCount]);

  return (<>
    <SpeedDial
      key={actions?.[0].name ?? 0}
      ariaLabel='Management System Actions'
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
      }}
      icon={stagedCount > 0 ? (<>
        <Text variant="body1">{stagedCount}</Text>
        <Settings fontSize="large" sx={{ opacity: 0.25, position: 'absolute' }} />
      </>) : (
        <Settings fontSize="large" />
      )}
      open={open}
      hidden={!actions}
      FabProps={{
        onClick: () => openSet(!open),
        sx: {
          color: 'text.primary',
          bgcolor: 'background.paper',
          '&:hover': {
            opacity: 0.8,
            bgcolor: 'background.paper',
          },
        },
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.id}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => { handleClose(); action.onClick(); } }
        />
      ))}
    </SpeedDial>
    <Backdrop open={open} onClick={handleClose} sx={{ zIndex: 100 }} />
  </>);
};

export default ManagerSpeedDial;
