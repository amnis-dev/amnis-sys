import type {
  IoContext,
  IoProcessDefinition,
  IoProcessMapMethods,
  Agent,
  UID,
} from '@amnis/state';
import type {
  RestHandler,
  StartOptions,
} from 'msw';

export interface MockOptions {
  hostname?: string;
  baseUrl?: string;
  processes?: Record<string, IoProcessDefinition>;
  context?: IoContext;
  debug?: boolean;
  clearStorage?: boolean;
}

export type MockHandlers = (
  baseUrl: string,
  context: IoContext,
  endpoints: IoProcessMapMethods,
) => RestHandler[];

export type MockAgentAdmin = Agent & {
  $id: UID;
  name: 'Administrator Mock Agent',
  type: 'mock',
  publicKey: string;
  privateKey: string;
  $credential: UID;
};

export type MockAgentExec = Agent & {
  $id: UID;
  name: 'Executive Mock Agent',
  type: 'mock',
  publicKey: string;
  privateKey: string;
  $credential: UID;
};

export type MockAgentUser = Agent & {
  $id: UID;
  name: 'User Mock Agent',
  type: 'mock',
  publicKey: string;
  privateKey: string;
  $credential: UID;
};

export type MockService = {
  setup: (options?: MockOptions) => Promise<void>;
  start: (options?: StartOptions) => void;
  agents: () => Agent[];
  stop: () => void;
}
