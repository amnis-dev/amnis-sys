import type { IoProcessDefinition } from '@amnis/state';
import { processSysSystem } from './sys.system.js';
import { processSysSchema } from './sys.schema.js';
import { processSysLocale } from './sys.locale.js';

export const sys: IoProcessDefinition = {
  meta: {
    reducerPath: 'apiSys',
    bearer: ['schema'],
  },
  endpoints: {
    get: {
      system: processSysSystem,
    },
    post: {
      schema: processSysSchema,
      locale: processSysLocale,
    },
  },
};

export default sys;
