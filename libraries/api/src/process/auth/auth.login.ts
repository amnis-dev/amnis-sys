import type {
  Io,
  IoProcess,
  EntityObjects,
} from '@amnis/state';
import {
  ioOutputApply,
} from '@amnis/state';
import type { ApiAuthLogin } from '../../api.auth.types.js';
import {
  mwChallenge, mwCredential, mwSignature, mwValidate,
} from '../../mw/index.js';
import { authenticateLogin } from '../../utility/authenticate.js';

const process: IoProcess<
Io<ApiAuthLogin, EntityObjects>
> = (context) => (
  async (input, output) => {
    const { body, signature } = input;

    if (!signature) {
      output.status = 401;
      output.json.logs.push({
        level: 'error',
        title: 'Missing Signature',
        description: 'A cryptographic signature is required.',
      });
      return output;
    }

    const outputAuthentication = await authenticateLogin(
      context,
      signature,
      body,
    );

    /**
     * Complete the authentication.
     */
    ioOutputApply(
      output,
      outputAuthentication,
    );

    return output;
  }
);

export const processAuthLogin = mwValidate('auth/ApiAuthLogin')(
  mwChallenge()(
    mwCredential(true)(
      mwSignature()(
        process,
      ),
    ),
  ),
) as IoProcess<
Io<ApiAuthLogin, EntityObjects>
>;

export default { processAuthLogin };
