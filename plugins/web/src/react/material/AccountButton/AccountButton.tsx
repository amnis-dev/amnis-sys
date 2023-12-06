import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton, ListItemIcon, Menu, MenuItem,
} from '@mui/material';
import {
  AccountCircle, AppRegistration, Login, Settings,
} from '@mui/icons-material';
import { sessionSlice, systemSlice, userSlice } from '@amnis/state';
import {
  useLocale, useMenu, useWebSelector,
} from '@amnis/web/react/hooks';
import {
  Text, AccountAuthenticate, Ider, iderEn,
} from '@amnis/web/react/material';
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

  const [accountAuthenticateOpen, accountAuthenticateOpenSet] = React.useState(false);

  const MenuItemsAnonymous = React.useCallback<React.FC>(() => (<>
    <Ider entities={[
      iderEn(locale['!account.signin'], 'value'),
    ]}>
      <MenuItem
        onClick={() => {
          accountAuthenticateOpenSet(true);
          handleClose();
        }}
      >
        <ListItemIcon><Login /></ListItemIcon>

        <Text>{locale['!account.signin'].value}</Text>
      </MenuItem>
    </Ider>
    {isRegistrationEnabled ? (
      <Ider entities={[
        iderEn(locale['!account.signup'], 'value'),
      ]}>
        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon><AppRegistration /></ListItemIcon>
          <Text>{locale['!account.signup'].value}</Text>
        </MenuItem>
      </Ider>
    ) : null}
  </>), [handleClose, locale, isRegistrationEnabled]);

  const MenuItemsAccount = React.useCallback<React.FC>(() => (<>
    <Ider entities={[
      iderEn(locale['!account.account'], 'value'),
    ]}>
      <MenuItem
        onClick={handleClose}
      >
        <ListItemIcon><AccountCircle /></ListItemIcon>
        <Text>{locale['!account.account'].value}</Text>
      </MenuItem>
    </Ider>
    {isPrivledged ? (
      <Ider entities={[
        iderEn(locale['!account.manage'], 'value'),
      ]}>
        <MenuItem
          selected={manager}
          onClick={() => {
            managerSet(!manager);
            handleClose();
          }}
        >
          <ListItemIcon><Settings /></ListItemIcon>
          <Text>{locale['!account.manage'].value}</Text>
        </MenuItem>
      </Ider>
    ) : null}
  </>), [handleClose, locale, isPrivledged, manager, managerSet]);

  return (<>
    <IconButton {...buttonProps}>
      <AccountCircle />
    </IconButton>
    <Menu {...menuProps}>
      {user ? <MenuItemsAccount /> : <MenuItemsAnonymous />}
    </Menu>
    <Dialog
      open={accountAuthenticateOpen}
      onClose={() => accountAuthenticateOpenSet(false)}
      fullWidth
    >
      <DialogTitle component="div">
        <Text inherit>
          Authenticate
        </Text>
      </DialogTitle>
      <DialogContent>
        <AccountAuthenticate />
      </DialogContent>
    </Dialog>
  </>);
};

export default AccountButton;
