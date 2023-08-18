import type {
  Credential,
  IoContext,
  IoOutput,
  DataCreator,
  EntityObjects,
  DataUpdater,
  User,
} from '@amnis/state';
import {
  credentialSlice,
  handleSlice,
  profileSlice,
  userSlice,
  contactSlice,
  dataActions,
  entityCreate,
  ioOutput,
  stateEntitiesCreate,
  systemSlice,
} from '@amnis/state';
import { findUserByHandle } from './find.js';

/**
 * Options for creating an account.
 */
export interface AccountCreateOptions {
  /**
   * The handle for the account. Also called the handle.
   */
  handle: string;
  /**
   * The password to set for the account.
   */
  password: string;
  /**
   * Account email for recovery.
   */
  email?: string;
  /**
   * Sets the profile display name.
   * Defaults to the handle.
   */
  nameDisplay?: string;
  /**
   * Optionally set a credential when this account is created.
   * NOTE: Without a credential, authentication is impossible.
   * The credential can be added later.
   */
  credential?: Credential;
}

/**
 * Creates a new account.
 */
export const accountCreate = async (
  context: IoContext,
  options: AccountCreateOptions,
): Promise<IoOutput<EntityObjects | undefined>> => {
  const output = ioOutput();
  const { store, database, crypto } = context;

  const {
    handle,
    password,
    email,
    nameDisplay,
    credential,
  } = options;

  /**
   * Ensure the handle name doesn't already exist in the database.
   */
  const userFound = await findUserByHandle(context, handle);

  if (userFound) {
    output.status = 500;
    output.json.logs.push({
      level: 'error',
      title: 'Handle Already Registered',
      description: `The handle "${handle}" has already been registered.`,
    });
    return output;
  }

  /**
   * Get the initial roles for a newly created user.
   */
  const systemActive = systemSlice.select.active(store.getState());

  if (!systemActive) {
    output.status = 503;
    output.json.logs.push({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available for creating an account.',
    });
    return output;
  }

  /**
   * Fetch the initial roles from system settings for the new account.
   */
  const { $initialRoles } = systemActive;

  /**
   * Hash the given password.
   */
  const passwordHashed = await crypto.passHash(password);

  /**
   * Create the new contact to link to the account profile.
   */
  const contact = contactSlice.create({
    name: handle,
  });

  /**
   * Initialize the new user creator.
   */
  const user = userSlice.create({
    handle,
    password: passwordHashed,
    email,
    $roles: $initialRoles,
  });

  /**
   * Create a handle reference.
   */
  const handleCreate = handleSlice.create({
    name: handle,
    $subject: user.$id,
  });

  /**
   * Add credentials to the user if set.
   */
  if (credential) {
    user.$credentials.push(credential.$id);
  }

  /**
   * Create a new profile
   */
  const profile = profileSlice.create({
    nameDisplay: nameDisplay ?? handle,
    $user: user.$id,
    $contact: contact.$id,
  });

  /**
   * Initalize an entities object to commit.
   */
  const stateEntities: EntityObjects = stateEntitiesCreate({
    [userSlice.key]: [user],
    [handleSlice.key]: [handleCreate],
    [profileSlice.key]: [profile],
    [contactSlice.key]: [contact],
  }, { $owner: user.$id, new: false, committed: true });

  /**
   * Append credentials if set.
   */
  if (credential) {
    stateEntities[credentialSlice.key] = [
      entityCreate(credential, { $owner: user.$id, new: false, committed: true }),
    ];
  }

  /**
   * Commit the new data into the database.
   */
  database.create(stateEntitiesCreate(stateEntities));

  output.status = 200;
  output.json.result = stateEntities;
  output.json.logs.push({
    level: 'success',
    title: 'Account Created',
    description: `The new account "${handle}" has been registered.`,
  });

  return output;
};

/**
 * Adds a new credential to a user.
 */
export const accountCredentialAdd = async (
  context: IoContext,
  user: User,
  credential: Credential,
): Promise<IoOutput<EntityObjects | undefined>> => {
  const output = ioOutput();
  const { store, database } = context;

  const $credentials = [...user.$credentials, credential.$id];

  const stateCreator: DataCreator = {
    [credentialSlice.key]: [credential],
  };
  const stateEntities = stateEntitiesCreate(stateCreator);

  // No need to wait for this promise...
  database.create(stateEntities);

  const stateUpdater: DataUpdater = {
    [userSlice.key]: [
      {
        $id: user.$id,
        $credentials,
      },
    ],
  };

  const resultUpdate = await database.update(stateUpdater);
  /**
   * Dispatch the result to update memory cached entities.
   */
  store.dispatch(dataActions.create(resultUpdate));

  output.status = 200;
  output.json.result = {
    ...stateEntities,
    ...resultUpdate,
  };
  output.json.logs.push({
    level: 'success',
    title: 'Credential Added',
    description: 'The new credential has been added.',
  });

  return output;
};
