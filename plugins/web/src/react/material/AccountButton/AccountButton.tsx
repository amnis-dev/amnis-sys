import React from 'react';

import {
  IconButton, ListItemIcon, Menu, MenuItem,
} from '@mui/material';
import {
  AccountCircle, AppRegistration, Login, Settings,
} from '@mui/icons-material';
import { sessionSlice, systemSlice, userSlice } from '@amnis/state';
import {
  useLocale, useMenu, useWebSelector,
} from '@amnis/web/react/hooks';
import { Text } from '@amnis/web/react/material';
import { WebContext } from '@amnis/web/react';

export const AccountButton: React.FC = () => {
  const system = useWebSelector(systemSlice.select.active);
  const user = useWebSelector(userSlice.select.active);
  const session = useWebSelector(sessionSlice.select.active);

  const { manager, managerSet } = React.useContext(WebContext);

  const isRegistrationEnabled = !!system?.registrationOpen;
  const isPrivledged = !!session?.prv;

  const localeNames = React.useRef([
    '!account.signin',
    '!account.signup',
    '!account.account',
    '!account.manage',
  ] as const);
  const locale = useLocale(localeNames.current);

  const {
    buttonProps,
    menuProps,
    handleClose,
  } = useMenu('account-button');

  const MenuItemsAnonymous = React.useCallback<React.FC>(() => (<>
    <MenuItem
      onClick={() => {
        handleClose();
      }}
    >
      <ListItemIcon><Login /></ListItemIcon>
      <Text>{locale['!account.signin']}</Text>
    </MenuItem>
    {isRegistrationEnabled ? (<MenuItem
      onClick={() => {
        handleClose();
      }}
    >
      <ListItemIcon><AppRegistration /></ListItemIcon>
      <Text>{locale['!account.signup']}</Text>
    </MenuItem>) : null}
  </>), [handleClose, locale, isRegistrationEnabled]);

  const MenuItemsAccount = React.useCallback<React.FC>(() => (<>
    <MenuItem
      onClick={handleClose}
    >
      <ListItemIcon><AccountCircle /></ListItemIcon>
      <Text>{locale['!account.account']}</Text>
    </MenuItem>
    {isPrivledged ? (<MenuItem
      selected={manager}
      onClick={() => {
        managerSet(!manager);
        handleClose();
      }}
    >
      <ListItemIcon><Settings /></ListItemIcon>
      <Text>{locale['!account.manage']}</Text>
    </MenuItem>) : null}
  </>), [handleClose, locale, isPrivledged, manager, managerSet]);

  return (<>
    <IconButton {...buttonProps}>
      <AccountCircle />
    </IconButton>
    <Menu {...menuProps}>
      {user ? <MenuItemsAccount /> : <MenuItemsAnonymous />}
    </Menu>
  </>);
};

export default AccountButton;
