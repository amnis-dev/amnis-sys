import React from 'react';
import { noop } from '@amnis/state';
import type { MockAgents, MockService } from '@amnis/mock';

export type MockerAccount = keyof MockAgents | undefined;

export interface MockerContextProps {
  /**
   * The mock service.
   */
  service?: MockService;

  /**
   * The mock account to use.
   */
  account?: MockerAccount;

  /**
   * Sets the mock account.
   */
  accountSet: (account: MockerAccount) => void;
}

export const mockerContextDefault: MockerContextProps = {
  accountSet: noop,
};

export const MockerContext = React.createContext(mockerContextDefault);
