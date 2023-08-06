import type { DataCreator } from '../../data.types.js';
import { localeCreate, localeSlice } from './locale.js';

/**
 * English logs.
 */
export const localeDataEnLogs = localeCreate({
  code: 'en-us',
  set: 'logs',
  t: {
    error_required_name_title: 'Name Required',
    error_required_name_desc: 'The system "{active.system.name}" needs a name.',
    error_required_name_desc_bad_var: 'The system "{active.sys.name}" needs a name.',
  },
});

/**
 * Initial data for locale state.
 */
export const localeDataEnCreate: DataCreator = {
  [localeSlice.key]: [
    localeDataEnLogs,
  ],
};
