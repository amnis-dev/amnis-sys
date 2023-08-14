import type { IoProcessDefinition } from '@amnis/state';
import { sys } from './sys/index.js';
import { auth } from './auth/index.js';
import { crud } from './crud/index.js';

export * from './sys/index.js';
export * from './auth/index.js';
export * from './crud/index.js';

export const process: Record<string, IoProcessDefinition> = {
  sys,
  auth,
  crud,
};

export default process;
