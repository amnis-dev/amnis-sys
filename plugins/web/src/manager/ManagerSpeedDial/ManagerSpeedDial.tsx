import React from 'react';
import { Backdrop, SpeedDial, SpeedDialAction } from '@mui/material';
import {
  AdminPanelSettings, Build, Language, PeopleAlt, Save, Settings,
} from '@mui/icons-material';
import { ManagerContext } from '../ManagerContext.js';

export const ManagerSpeedDial: React.FC = () => {
  const [open, openSet] = React.useState(false);

  const handleOpen = React.useCallback(() => openSet(true), [openSet]);
  const handleClose = React.useCallback(() => openSet(false), [openSet]);

  const { locale, pathnameSet } = React.useContext(ManagerContext);

  const handleNavigate = React.useCallback((path: string) => {
    pathnameSet(path);
  }, [pathnameSet]);

  /**
   * Create speeddial actions.
   */
  const actions = React.useMemo(() => [
    {
      id: 'save',
      icon: <Save />,
      name: locale?.['web:manager:speeddial_save'] ?? '...',
      onClick: () => handleNavigate('/'),
    },
    {
      id: 'manager',
      icon: <Build />,
      name: locale?.['web:manager:speeddial_manager'] ?? '...',
      onClick: () => handleNavigate('/Manager'),
    },
    {
      id: 'localization',
      icon: <Language />,
      name: locale?.['web:manager:speeddial_localization'] ?? '...',
      onClick: () => handleNavigate('/Localization'),
    },
    {
      id: 'accounts',
      icon: <PeopleAlt />,
      name: locale?.['web:manager:speeddial_accounts'] ?? '...',
      onClick: () => handleNavigate('/Accounts'),
    },
    {
      id: 'administration',
      icon: <AdminPanelSettings />,
      name: locale?.['web:manager:speeddial_administration'] ?? '...',
      onClick: () => handleNavigate('/Administration'),
    },
  ], [locale]);

  return (<>
    <SpeedDial
      key={actions?.[0].name ?? 0}
      ariaLabel='Management System Actions'
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
      }}
      icon={<Settings />}
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
