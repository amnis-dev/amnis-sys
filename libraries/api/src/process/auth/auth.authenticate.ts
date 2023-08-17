import type {
  Io,
  IoProcess,
  EntityObjects,
  IoMiddleware,
  IoInput,
} from '@amnis/state';
import {
  systemSlice,

  ioOutputApply,
} from '@amnis/state';
import type { ApiAuthAuthenticate } from '../../api.auth.types.js';
import {
  mwValidate,
  mwSession,
  mwChallenge,
  mwSignature,
  mwCredential,
} from '../../mw/index.js';
import { authenticateFinalize, findUserById } from '../../utility/index.js';

const process: IoProcess<
Io<ApiAuthAuthenticate, EntityObjects>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const { session } = input;

    if (!session) {
      return output;
    }

    /**
     * Get the active system.
     */
    const system = systemSlice.select.active(store.getState());

    if (!system) {
      output.status = 503; // 503 Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to authenticate.',
      });
      return output;
    }

    /**
     * Getting here means all the authentication checks were valid.
     * The session holder can be logged in.
     */
    const user = await findUserById(context, session.$subject);

    if (!user) {
      output.status = 500; // 500 Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'User Not Found',
        description: 'Could not find the user described in the session.',
      });
      return output;
    }

    ioOutputApply(output, await authenticateFinalize(context, user.$id, session.$credential));

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
  const { body: { silent } } = input;
  const outputNext = await next(context)(input, output);

  if (silent) {
    outputNext.status = 200;
    outputNext.json.logs = [];
  }

  return outputNext;
};

export const processAuthAuthenticate = mwValidate('auth/ApiAuthAuthenticate')(
  mwSilencer()(
    mwSession()(
      mwChallenge()(
        mwCredential()(
          mwSignature()(
            process,
          ),
        ),
      ),
    ),
  ),
) as IoProcess<
Io<ApiAuthAuthenticate, EntityObjects>
>;

export default { processAuthAuthenticate };
