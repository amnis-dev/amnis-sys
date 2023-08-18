import type {
  IoContext,
  IoOutput,
  EntityObjects,
} from '@amnis/state';
import {
  credentialSlice,
} from '@amnis/state';
import type { ApiAuthRegister } from '../api.auth.types.js';
import { accountCreate } from './account.js';

/**
 * Accounts the registration process creating and return the new account information.
 */
export const registerAccount = async (
  context: IoContext,
  apiAuthRegistration: ApiAuthRegister,
  ip?: string,
): Promise<IoOutput<EntityObjects | undefined>> => {
  /**
   * Create the new credential to store in the database.
   */
  const credential = credentialSlice.create({
    name: apiAuthRegistration.credential.name,
    publicKey: apiAuthRegistration.credential.publicKey,
    ip,
  });
  // Ensure we don't change the credential identifier.
  // This is a very unique case that we use a client generated ID.
  credential.$id = apiAuthRegistration.credential.$id;

  const output = await accountCreate(
    context,
    {
      handle: apiAuthRegistration.handle,
      password: apiAuthRegistration.password,
      email: apiAuthRegistration.email,
      credential,
    },
  );

  return output;
};

export default { registerAccount };
