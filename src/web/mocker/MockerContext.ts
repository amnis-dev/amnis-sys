import React from 'react';
import { noop } from '@amnis/state';
import type { MockAgents } from '@amnis/mock';

export type MockerAccount = keyof MockAgents | undefined;

export interface MockerContextProps {
  /**
   * The mock account to use.
   */
  account: MockerAccount;

  /**
   * Sets the mock account.
   */
  accountSet: (account: MockerAccount) => void;
}

export const mockerContextDefault: MockerContextProps = {
  account: undefined,
  accountSet: noop,
};

export const MockerContext = React.createContext(mockerContextDefault);
