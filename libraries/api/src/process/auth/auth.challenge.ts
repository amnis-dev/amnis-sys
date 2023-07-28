import type {
  Io,
  IoProcess,
  Challenge,
  Entity,
} from '@amnis/state';
import {
  ioOutputApply,
  systemSlice,
} from '@amnis/state';
import type { ApiAuthChallenge } from '../../api.auth.types.js';
import { mwValidate } from '../../mw/index.js';
import { challengeNew } from '../../utility/challenge.js';

const process: IoProcess<
Io<ApiAuthChallenge, Challenge>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const system = systemSlice.select.active(store.getState());

    if (!system) {
      output.status = 503;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to generate a challenge.',
      });
      return output;
    }

    ioOutputApply(output, await challengeNew(context));
    return output;
  }
);

export const processAuthChallenge = mwValidate('auth/ApiAuthChallenge')(
  process,
) as IoProcess<
Io<ApiAuthChallenge, Entity<Challenge>>
>;

export default { processAuthChallenge };
