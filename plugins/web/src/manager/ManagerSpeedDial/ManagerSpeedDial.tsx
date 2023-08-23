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

  const { locale } = React.useContext(ManagerContext);

  /**
   * Create speeddial actions.
   */
  const actions = React.useMemo(() => [
    { id: 'save', icon: <Save />, name: locale?.['web:manager:speeddial_save'] ?? '...' },
    { id: 'manager', icon: <Build />, name: locale?.['web:manager:speeddial_manager'] ?? '...' },
    { id: 'localization', icon: <Language />, name: locale?.['web:manager:speeddial_localization'] ?? '...' },
    { id: 'accounts', icon: <PeopleAlt />, name: locale?.['web:manager:speeddial_accounts'] ?? '...' },
    { id: 'administration', icon: <AdminPanelSettings />, name: locale?.['web:manager:speeddial_administration'] ?? '...' },
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
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      hidden={!actions}
      FabProps={{
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
          onClick={handleClose}
        />
      ))}
    </SpeedDial>
    <Backdrop open={open} onClick={handleClose} />
  </>);
};

export default ManagerSpeedDial;
