import type { IoProcessDefinition } from '@amnis/state';
import { processSysSystem } from './sys.system.js';
import { processSysSchema } from './sys.schema.js';

export const processSys: IoProcessDefinition = {
  meta: {
    reducerPath: 'apiSys',
  },
  endpoints: {
    get: {
      system: processSysSystem,
      schema: processSysSchema,
    },
  },
};

export default processSys;
