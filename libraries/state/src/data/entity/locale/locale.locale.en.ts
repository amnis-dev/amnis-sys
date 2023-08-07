import type { DataCreator } from '../../data.types.js';
import { localeCreate, localeSlice } from './locale.js';

/**
 * English logs.
 */
export const localeDataEnLogs = [
  localeCreate({
    code: 'en',
    name: 'error_required_name_title',
    value: 'Name Required',
  }),
  localeCreate({
    code: 'en',
    name: 'error_required_name_desc',
    value: 'The system "{active.system.name}" needs a name.',
  }),
  localeCreate({
    code: 'en',
    name: 'error_required_name_desc_bad_var',
    value: 'The system "{systemName}" needs a name.',
  }),
];

/**
 * Initial data for locale state.
 */
export const localeDataEnCreate: DataCreator = {
  [localeSlice.key]: localeDataEnLogs,
};
