import type { IoProcessDefinition } from '@amnis/state';
import { processSysSystem } from './sys.system.js';
import { processSysSchema } from './sys.schema.js';

export const sys: IoProcessDefinition = {
  meta: {
    reducerPath: 'apiSys',
    bearer: ['schema'],
  },
  endpoints: {
    get: {
      system: processSysSystem,
      schema: processSysSchema,
    },
  },
};

export default sys;
