import type {
  Io,
  IoProcess,
  DataDeleter,
  IoMiddleware,
  IoInput,
} from '@amnis/state';
import {
  sessionSlice,
  uidList,
  systemSlice,
} from '@amnis/state';
import type { ApiAuthAuthenticate, ApiAuthLogout } from '../../api.auth.types.js';
import { mwSession, mwValidate } from '../../mw/index.js';

/**
 * Renews a session holder's session and access bearers.
 */
const process: IoProcess<
Io<ApiAuthLogout, DataDeleter>
> = (context) => (
  async (input, output) => {
    const { session } = input;

    /**
   * Get the active system.
   */
    const system = systemSlice.select.active(context.store.getState());

    if (!system) {
      output.status = 503;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to complete the logout.',
      });
      return output;
    }

    /**
     * Delete the session cookie.
     */
    output.cookies[system.sessionKey] = undefined;

    /**
     * Tell the client to delete with the session.
     */
    if (session) {
      output.json.result = {
        [sessionSlice.key]: uidList([session.$id]),
      };
    }

    return output;
  }
);

/**
 * Specific middleware to silence log output.
 */
const mwSilencer: IoMiddleware = () => (next) => (context) => async (
  input: IoInput<ApiAuthAuthenticate>,
  output,
) => {
  const outputNext = await next(context)(input, output);
  outputNext.status = 200;
  outputNext.json.logs = [];

  return outputNext;
};

export const processAuthLogout = mwSilencer()(
  mwSession()(
    mwValidate('auth/ApiAuthLogout')(
      process,
    ),
  ),
) as IoProcess<
Io<ApiAuthLogout, DataDeleter>
>;

export default { processAuthLogout };
