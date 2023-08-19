import React from 'react';
import {
  Backdrop, CircularProgress, Stack, Typography,
} from '@mui/material';
import { agentSlice } from '@amnis/state';
import { useWebDispatch, useWebSelector } from '@amnis/web';
import type { MockAgents } from '@amnis/mock';
import { mockService } from '@amnis/mock';
import { apiAuth } from '@amnis/api';
import { MockerContext } from './MockerContext.js';

export const MockerAgent: React.FC = () => {
  const dispatch = useWebDispatch();
  const agent = useWebSelector(agentSlice.select.active);

  const { account } = React.useContext(MockerContext);

  const agentMocks = React.useRef<MockAgents | undefined>();
  const [accountPrev, accountPrevSet] = React.useState(account);
  const [loading, loadingSet] = React.useState(true);

  const accountDisplayNames = React.useMemo<Record<keyof MockAgents, string>>(() => ({
    adminMock: 'Administrator',
    execMock: 'Executive',
    userMock: 'User',
  }), []);

  React.useEffect(() => {
    const mocked = mockService.agents();
    dispatch(agentSlice.action.insertMany(Object.values(mocked)));
    agentMocks.current = mocked;
  }, []);

  React.useEffect(() => {
    dispatch(agentSlice.action.activeSet((account && agentMocks.current?.[account].$id) || null));
  }, [account]);

  React.useEffect(() => {
    loadingSet(true);

    (async () => {
      if (account) {
        await dispatch(apiAuth.endpoints.login.initiate({
          handle: account,
          password: 'password',
        }));
      }
      if (!account && accountPrev !== undefined) {
        await dispatch(apiAuth.endpoints.logout.initiate({}));
      }
      loadingSet(false);
      accountPrevSet(account);
    })();
  }, [agent]);

  return loading ? (
    <Backdrop
      sx={{ color: '#fff' }}
      open={true}
    >
      <Stack alignItems="center" gap={2}>
        {account ? (
          <Typography>Authenticating as {accountDisplayNames[account]}</Typography>
        ) : (
          <Typography>Setting Anonymous Session</Typography>
        )}
        <CircularProgress color="inherit" />
      </Stack>
    </Backdrop>
  ) : null;
};

export default MockerAgent;
