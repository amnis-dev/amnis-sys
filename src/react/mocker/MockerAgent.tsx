import React from 'react';
import {
  Backdrop, CircularProgress, Stack, Typography,
} from '@mui/material';
import type { AgentID } from '@amnis/state';
import { agentSlice } from '@amnis/state';
import { useWebDispatch, useWebSelector } from '@amnis/web';
import { mockService } from '@amnis/mock';
import { apiAuth } from '@amnis/api';
import type { MockerAccount } from './MockerContext.js';
import { MockerContext } from './MockerContext.js';

export const MockerAgent: React.FC = () => {
  const dispatch = useWebDispatch();
  const agent = useWebSelector(agentSlice.select.active);

  const { account } = React.useContext(MockerContext);

  const [accountPrev, accountPrevSet] = React.useState(account);
  const [agentMocks, agentMocksSet] = React.useState<
  Record<Extract<MockerAccount, string>, AgentID | undefined>>({
    adminMock: undefined,
    execMock: undefined,
    userMock: undefined,
  });
  const [loading, loadingSet] = React.useState(true);

  const accountDisplayNames = React.useMemo<Record<Extract<MockerAccount, string>, string>>(() => ({
    adminMock: 'Administrator',
    execMock: 'Executive',
    userMock: 'User',
  }), []);

  React.useEffect(() => {
    const mocked = mockService.agents();
    dispatch(agentSlice.action.insertMany([...mocked]));
    agentMocksSet({
      adminMock: mocked[0].$id,
      execMock: mocked[1].$id,
      userMock: mocked[2].$id,
    });
  }, []);

  React.useEffect(() => {
    dispatch(agentSlice.action.activeSet((account && agentMocks[account]) || null));
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
