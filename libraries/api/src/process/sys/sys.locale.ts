import type {
  Io,
  IoProcess,
} from '@amnis/state';
import {
  entityStrip,
  systemSlice,
} from '@amnis/state';
import type { ApiSysLocale } from '../../api.sys.types.js';
import { findLocaleByNames } from '../../utility/index.js';
import { mwValidate } from '../../mw/index.js';

/**
 * Obtains system and api information.
 * This is fundemental information needed by the client to function.
 */
export const process: IoProcess<
Io<ApiSysLocale, Record<string, never>>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const { body: { language: languageParam, keys }, language } = input;

    /**
     * Get the active system.
     */
    const system = systemSlice.select.active(store.getState());

    if (!system) {
      output.status = 503; // 503 Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to obtain.',
      });
      return output;
    }

    /**
     * Ensure all keys start with a '!' to indicate that no authorization
     * associated data is required for the locale strings.
     */
    if (!keys.every((key) => key.startsWith('!'))) {
      output.status = 400; // 400 Bad Request
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Locale Key',
        description: 'All locale keys must start with a \'!\'.',
      });
      return output;
    }

    const localeEntities = await findLocaleByNames(context, keys, languageParam ?? language);
    output.json.locale = localeEntities?.map((l) => entityStrip(l));

    return output;
  }
);

export const processSysLocale = mwValidate('sys/ApiSysLocale')(
  process,
) as IoProcess<
Io<ApiSysLocale, Record<string, never>>
>;

export default processSysLocale;
