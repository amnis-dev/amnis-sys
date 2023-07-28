import type {
  IoMiddleware,
  Credential,
  UID,
} from '@amnis/state';
import { findCredentialById } from '../utility/find.js';

/**
 * Attempts to find and set the current client credential.
 */
export const mwCredential: IoMiddleware<boolean | void> = (
  dontSearch = false,
) => (next) => (context) => async (input, output) => {
  const { session, body: { $credential, credential } } = input;

  if (!$credential && !credential && !session) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'A previous authorization is required.',
    });
    return output;
  }

  const $id: UID<Credential> = $credential ?? credential?.$id ?? session?.$credential;

  const credentialResult = dontSearch ? credential : await findCredentialById(context, $id);

  if (!credentialResult) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'The credential provided is not valid.',
    });
    return output;
  }

  input.credential = credentialResult;

  return next(context)(input, output);
};

export default { mwCredential };
