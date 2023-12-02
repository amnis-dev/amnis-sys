import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { systemSlice } from '@amnis/state';
import { Entry, Text } from '@amnis/web/react/material';
import { useLocale, useWebSelector } from '@amnis/web/react/hooks';

export const AccountAuthenticate: React.FC = () => {
  const registrationOpen = useWebSelector(
    (state) => systemSlice.select.active(state)?.registrationOpen,
  );

  const localeNames = React.useRef([
    '!account.signin',
  ] as const);
  const locale = useLocale(localeNames.current);

  const formSchema = React.useMemo(() => ({
    $id: 'accountsignin',
    title: locale['!account.signin'],
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

  const handleFormChange = React.useCallback((value: any) => {
    formValueSet({
      ...formValue,
      ...value,
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
          <Button>
            <Text>Create a new account</Text>
          </Button>
        </Box>
        {registrationOpen ? (
          <Box>
            <Button variant="contained" color="primary" startIcon={<Lock />}>
              <Text>{locale['!account.signin']}</Text>
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default AccountAuthenticate;
