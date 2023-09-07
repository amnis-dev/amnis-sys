import type { MockOptions } from '@amnis/mock';
import { schemaState } from '@amnis/state/schema';
import { contextSetup } from '@amnis/state/context';
import { sys, auth, crud } from '../../../process/index.js';
import { schemaAuth, schemaSys } from '../../../schema/index.js';

export const baseUrl = '/api';

export const serviceConfig = async (): Promise<MockOptions> => {
  const context = await contextSetup({
    schemas: [schemaState, schemaAuth, schemaSys],
  });
  return {
    baseUrl,
    context,
    processes: {
      sys,
      auth,
      crud,
    },
  };
};
