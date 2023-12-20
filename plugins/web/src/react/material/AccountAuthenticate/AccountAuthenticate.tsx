import React from 'react';
import {
  Box, Button, Stack,
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import { systemSlice } from '@amnis/state';
import {
  Entry, Ider, Text, iderEn,
} from '@amnis/web/react/material';
import { useAuthLogin, useLocale, useWebSelector } from '@amnis/web/react/hooks';

export const AccountAuthenticate: React.FC = () => {
  const registrationOpen = useWebSelector(
    (state) => systemSlice.select.active(state)?.registrationOpen,
  );

  const { authLogin, authLoginErrored } = useAuthLogin();

  const localeNames = React.useRef([
    '!account.create',
    '!account.signin',
  ] as const);
  const locale = useLocale(localeNames.current);

  console.log(locale);

  const formSchema = React.useMemo(() => ({
    $id: 'accountsignin',
    title: locale['!account.signin'].value,
    type: 'object',
    properties: {
      username: {
        title: 'Username',
        type: 'string',
      },
      password: {
        title: 'Password',
        type: 'string',
        format: 'password',
      },
    },
    required: ['username', 'password'],
  }), [locale]);

  const [formValue, formValueSet] = React.useState({
    username: '',
    password: '',
  });

  const signInDisabled = !formValue.username.length || !formValue.password.length;

  const shakeSx = React.useMemo(() => ({
    animation: 'shake 1s',
    animationIterationCount: '1',
    position: 'relative',
    left: 0,
    bgcolor: 'primary.main',
    '@keyframes shake': {
      '15%': { left: '-3px', bgcolor: 'primary.main' },
      '30%': { left: '3px', bgcolor: 'error.main' },
      '45%': { left: '-3px', bgcolor: 'error.main' },
      '60%': { left: '3px', bgcolor: 'primary.main' },
    },
    '&:hover': {
      bgcolor: 'primary.main',
    },
  }), []);

  const handleFormChange = React.useCallback((value: any) => {
    formValueSet({
      ...formValue,
      ...value,
    });
  }, [formValue]);

  const handleFormSubmit = React.useCallback(() => {
    const { username, password } = formValue;
    authLogin({
      handle: username,
      password,
    });
  }, [formValue]);

  return (
    <Stack gap={4}>
      <Entry
        schema={formSchema}
        value={formValue}
        onChange={handleFormChange}
      />
      <Stack direction="row" gap={2}>
        <Box flex={1}>
          <Ider entities={[
            iderEn(locale['!account.create'], 'value'),
          ]}>
            <Button>
              <Text>{locale['!account.create'].value}</Text>
            </Button>
          </Ider>
        </Box>
        {registrationOpen ? (
          <Box>
            <Ider entities={[
              iderEn(locale['!account.signin'], 'value'),
            ]}>
              <Button
                variant="contained"
                color="primary"
                disabled={signInDisabled}
                startIcon={<Lock />}
                onClick={handleFormSubmit}
                sx={authLoginErrored ? shakeSx : undefined}
              >
                <Text>{locale['!account.signin'].value}</Text>
              </Button>
            </Ider>
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default AccountAuthenticate;
