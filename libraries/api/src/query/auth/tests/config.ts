import type { MockOptions } from '@amnis/mock';
import { contextSetup } from '@amnis/state/context';
import { sys, auth } from '../../../process/index.js';
import { schemaAuth } from '../../../schema/index.js';

export const baseUrl = '/api';

export const serviceConfig = async (): Promise<MockOptions> => {
  const context = await contextSetup({
    schemas: [schemaAuth],
  });
  return {
    baseUrl,
    context,
    processes: {
      sys,
      auth,
    },
  };
};
