import React from 'react';
import { Decorator } from '@storybook/react';
import { MockerAccount, MockerContext } from '../../src/web/index.js'

export const accountOptions: Record<string, MockerAccount> = {
  'Anonymous': undefined,
  'Administrator': 'adminMock',
  'Executive': 'execMock',
  'User': 'userMock',
} as const;

export type AccountOptions = typeof accountOptions;

export const decoratorAccounts: Decorator = (Story, context) => {
  const { accountSet } = React.useContext(MockerContext);

  const accountKey = React.useMemo<MockerAccount>(() => {
    const accountName = context.globals?.account as keyof AccountOptions;
    return accountOptions[accountName];
  }, [context.globals?.account]);

  React.useEffect(() => {
    accountSet(accountKey);
  }, [accountKey]);

  return <Story />
}

export default decoratorAccounts;
