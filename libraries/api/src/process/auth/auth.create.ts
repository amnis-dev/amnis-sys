import type {
  Io,
  IoProcess,
  EntityObjects,
} from '@amnis/state';
import {
  ioOutputApply,
  systemSlice,
} from '@amnis/state';
import type { ApiAuthCreate } from '../../api.auth.types.js';
import {
  mwChallenge, mwCredential, mwSession, mwSignature, mwValidate,
} from '../mw/index.js';
import { accountCreate } from '../utility/account.js';

const process: IoProcess<
Io<ApiAuthCreate, EntityObjects>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const { body, session } = input;
    const system = systemSlice.select.active(store.getState());

    if (!session) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Session Required',
        description: 'A session is required to proceed with account creation.',
      });
      return output;
    }

    if (!system) {
      output.status = 503;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available for account creation.',
      });
      return output;
    }

    if (session.prv !== true) {
      output.status = 401;
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Not authorized to create accounts.',
      });
      return output;
    }

    /**
     * Since all else checks out, create the account.
     */
    ioOutputApply(output, await accountCreate(context, body));

    return output;
  }
);

export const processAuthCreate = mwValidate('auth/ApiAuthCreate')(
  mwSession()(
    mwChallenge()(
      mwCredential()(
        mwSignature()(
          process,
        ),
      ),
    ),
  ),
) as IoProcess<
Io<ApiAuthCreate, EntityObjects>
>;

export default { processAuthCreate };
