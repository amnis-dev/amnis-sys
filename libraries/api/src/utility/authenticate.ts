import type {
  IoContext,
  IoOutput,
  User,
  EntityObjects,
  DataUpdater,
  UID,
} from '@amnis/state';
import {
  credentialSlice,
  userSlice,
  profileSlice,
  contactSlice,
  sessionSlice,
  ioOutput,
  entityCreate,
  dateJSON,
  systemSlice,
} from '@amnis/state';
import type { ApiAuthLogin } from '../api.auth.types.js';
import {
  findContactById,
  findCredentialById,
  findProfileByUserId,
  findUserByHandle,
  findUserById,
} from './find.js';
import { generateBearer, generateSession } from './generate.js';

const authenticateFailedOutput = (subtitle: string, description: string) => {
  const output = ioOutput();
  output.status = 401; // Unauthorized
  output.json.logs.push({
    level: 'error',
    title: `Authentication Failed: ${subtitle}`,
    description,
  });
  return output;
};

const authenticateFinalizeFailedOutput = (title: string, description: string) => {
  const output = ioOutput();
  output.status = 500; // Unauthorized
  output.json.logs.push({
    level: 'error',
    title,
    description,
  });
  return output;
};

/**
 * Finalize the user authentication by generating a session, token, and
 * returning account data. This does not verify any login parameters.
 *
 * Use authenticateLogin to authenticate securely.
 */
export const authenticateFinalize = async (
  context: IoContext,
  $user: UID<User>,
  $credential: UID<Credential>,
): Promise<IoOutput<EntityObjects>> => {
  const user = await findUserById(context, $user);

  if (!user) {
    return authenticateFinalizeFailedOutput(
      'No User',
      'No user information was found with the provided account data.',
    );
  }

  if (user.$credentials.indexOf($credential) < 0) {
    return authenticateFinalizeFailedOutput(
      'No Credential',
      'No credential information was found with the provided account data.',
    );
  }

  const profile = await findProfileByUserId(context, user.$id);

  if (!profile) {
    return authenticateFinalizeFailedOutput(
      'No Profile',
      'No profile information was found with the provided account data.',
    );
  }

  if (!profile.$contact) {
    return authenticateFinalizeFailedOutput(
      'No Contact Relation',
      'There is no contact information associated with the provided user account\'s profile.',
    );
  }

  const contact = await findContactById(context, profile.$contact);

  if (!contact) {
    return authenticateFinalizeFailedOutput(
      'No Contact',
      'No contact information was found with the provided user account\'s profile.',
    );
  }

  /**
   * Get the active system.
   */
  const system = systemSlice.select.active(context.store.getState());

  if (!system) {
    const output = ioOutput();
    output.status = 503;
    output.json.logs.push({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to complete the login.',
    });
    return output;
  }

  /**
   * Find the credentials in the database.
   */
  const credential = await findCredentialById(context, $credential);

  if (!credential) {
    return authenticateFailedOutput(
      'Missing Credential',
      'The provided credential could not be found.',
    );
  }

  /**
   * Create the authenticated user's session.
   */
  const sessionBase = await generateSession(
    system,
    user.$id,
    credential.$id,
    user.$roles,
  );

  const session = entityCreate(sessionBase, { $owner: user.$id, committed: true, new: false });
  const sessionEncrypted = await context.crypto.sessionEncrypt(sessionBase);

  /**
   * Create the authenticated user's access bearer token.
   */
  const bearerAccess = await generateBearer(context, system, user.$id, user.$roles);

  const stateEntities: EntityObjects = {
    [userSlice.key]: [user],
    [profileSlice.key]: [profile],
    [contactSlice.key]: [contact],
    [sessionSlice.key]: [session],
  };

  const output = ioOutput();
  output.json.result = stateEntities;
  output.cookies[system.sessionKey] = sessionEncrypted;
  output.json.bearers = [bearerAccess];

  output.json.logs.push({
    level: 'success',
    title: 'Authentication Successful',
    description: 'Credential has been verified.',
  });

  return output;
};

/**
 * Authenticates securely by verifying login parameters.
 */
export const authenticateLogin = async (
  context: IoContext,
  signature: ArrayBuffer,
  login: ApiAuthLogin,
): Promise<IoOutput> => {
  const { handle, credential, password } = login;

  /**
   * Find the user
   */
  const user = await findUserByHandle(context, handle);

  if (!user) {
    return authenticateFailedOutput(
      'User Not Found',
      `Could not find handle "${handle}".`,
    );
  }

  if (user.locked) {
    return authenticateFailedOutput(
      'Account Locked',
      'This account has been locked.',
    );
  }

  /**
   * Check if there's a password and it matches the user's password.
   */
  const passwordMatched = (password && user.password)
    ? await context.crypto.passCompare(password, user.password) : false;

  /**
   * Find the credentials on the user.
   */
  if (!user.$credentials.includes(credential.$id)) {
    if (passwordMatched) {
      const output = ioOutput();
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unknown Agent',
        description: 'The client agent requesting authentication is unrecognized.',
      });
      return output;
    }
    return authenticateFailedOutput(
      'Invalid Credential',
      'The provided credential is not valid for this user.',
    );
  }

  /**
   * Find the credentials in the database.
   */
  const credentialData = await findCredentialById(context, credential.$id);
  if (!credentialData) {
    return authenticateFailedOutput(
      'Missing Credential',
      'The provided credential could not be located for this user.',
    );
  }

  /**
   * Verify the signature with the credentialData public key.
   */
  const publicKey = await context.crypto.keyImport(credentialData.publicKey);
  const signatureVerified = await context.crypto.asymVerify(
    JSON.stringify(login),
    signature,
    publicKey,
  );

  if (!signatureVerified) {
    return authenticateFailedOutput(
      'Invalid Credential Signature',
      'The provided credential signature is not valid for this user.',
    );
  }

  if (!passwordMatched) {
    return authenticateFailedOutput(
      'Wrong Password',
      'The provided password is incorrect.',
    );
  }

  /**
   * Update the user and credential timestamps.
   */
  const dateTime = dateJSON();
  const updater: DataUpdater = {
    [userSlice.key]: [{
      $id: user.$id,
      logged: dateTime,
    }],
    [credentialSlice.key]: [{
      $id: credential.$id,
      updated: dateTime,
      used: dateTime,
    }],
  };
  context.database.update(updater);

  /**
   * All authentication checks can been completed.
   */
  const output = await authenticateFinalize(context, user.$id, credential.$id);

  return output;
};
