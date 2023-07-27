import type { DataCreator } from '../../data.types.js';
import { localeCreate, localeSlice, tk } from './locale.js';

/**
 * English logs.
 */
export const localeDataEnLogs = localeCreate({
  code: 'en',
  set: 'logs',
  t: {
    [tk('error_required_name_title')]: 'Name Required',
    [tk('error_required_name_desc')]: 'The {0} name must be defined.',
  },
  v: ['system'],
});

/**
 * Initial data for locale state.
 */
export const localeDataEnCreate: DataCreator = {
  [localeSlice.key]: [
    localeDataEnLogs,
  ],
};

export default { localeDataEnLogs, localeDataEnCreate };
