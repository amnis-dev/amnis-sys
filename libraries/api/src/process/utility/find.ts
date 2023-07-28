import type {
  Entity,
  IoContext,
  UID,
  User,
  Credential,
  Profile,
  Contact,
  HandleName,
  Handle,
  HandleNameId,
  Role,
} from '@amnis/state';
import {
  credentialSlice,
  userSlice,
  profileSlice,
  contactSlice,
  handleSlice,
  roleSlice,
  dataActions,
} from '@amnis/state';

/**
 * Finds a user by ID.
 */
export const findUserById = async (
  context: IoContext,
  $id: UID<User>,
): Promise<Entity<User> | undefined> => {
  const { store, database } = context;

  let user: Entity<User> | undefined;
  user = userSlice.select.byId(store.getState(), $id);

  if (!user) {
    const results = await database.read({
      [userSlice.key]: {
        $query: {
          $id: {
            $eq: $id,
          },
        },
      },
    });
    user = results[userSlice.key]?.[0] as Entity<User> | undefined;

    if (user) {
      store.dispatch(userSlice.action.insert(user));
    }
  }

  return user;
};

/**
 * Finds a user by handle.
 */
export const findUserByHandle = async (
  context: IoContext,
  handle: HandleName,
): Promise<Entity<User> | undefined> => {
  const resultsHandle = await context.database.read({
    [handleSlice.key]: {
      $query: {
        name: {
          $eq: handle,
        },
      },
    },
  });

  const handleEntity = resultsHandle[handleSlice.key]?.[0] as Entity<Handle> | undefined;

  if (!handleEntity) {
    return undefined;
  }

  return findUserById(context, handleEntity.$subject);
};

/**
 * Finds a user by ID or handle.
 */
export const findUser = async (
  context: IoContext,
  ref: UID | HandleNameId,
): Promise<Entity<User> | undefined> => {
  const magic = ref.charAt(0);
  if (magic === '@') {
    return findUserByHandle(context, ref.slice(1) as HandleName);
  }

  return findUserById(context, ref as UID);
};

/**
 * Finds a credential by ID.
 */
export const findCredentialById = async (
  context: IoContext,
  $id: UID<Credential>,
): Promise<Entity<Credential> | undefined> => {
  const { store, database } = context;

  let credential: Entity<Credential> | undefined;
  credential = credentialSlice.select.byId(store.getState(), $id);

  if (!credential) {
    const results = await database.read({
      [credentialSlice.key]: {
        $query: {
          $id: {
            $eq: $id,
          },
        },
      },
    });
    credential = results[credentialSlice.key]?.[0] as Entity<Credential> | undefined;

    if (credential) {
      store.dispatch(credentialSlice.action.insert(credential));
    }
  }

  return credential;
};

/**
 * Finds a profile by user Id.
 */
export const findProfileByUserId = async (
  context: IoContext,
  id: UID<User>,
): Promise<Entity<Profile> | undefined> => {
  const results = await context.database.read({
    [profileSlice.key]: {
      $query: {
        $user: {
          $eq: id,
        },
      },
    },
  });

  if (!results[profileSlice.key]?.length) {
    return undefined;
  }

  return results[profileSlice.key][0] as Entity<Profile>;
};

/**
 * Finds a contact by id.
 */
export const findContactById = async (
  context: IoContext,
  id: UID<Contact>,
): Promise<Entity<Contact> | undefined> => {
  const results = await context.database.read({
    [contactSlice.key]: {
      $query: {
        $id: {
          $eq: id,
        },
      },
    },
  });

  if (!results[contactSlice.key]?.length) {
    return undefined;
  }

  return results[contactSlice.key][0] as Entity<Contact>;
};

/**
 * Find roles by ids.
 */
export const findRolesByIds = async (
  context: IoContext,
  ids: UID<Role>[],
): Promise<Entity<Role>[]> => {
  const { store, database } = context;
  /**
   * Attempt to find the roles in the store cache first.
   */
  const state = store.getState();
  const roles = ids
    .map((id) => roleSlice.select.byId(state, id))
    .filter((role) => role !== undefined) as Entity<Role>[];

  /**
   * If all roles were found, no database query is needed...
   */
  if (roles.length === ids.length) {
    return roles;
  }

  /**
   * Roles were missing from cache. Fetch from the database.
   */
  const results = await database.read({
    [roleSlice.key]: {
      $query: {
        $id: {
          $in: ids,
        },
      },
    },
  });

  if (!results[roleSlice.key]?.length) {
    return [];
  }

  /**
   * Store the result into cache.
   */
  store.dispatch(dataActions.create(results));

  return results[roleSlice.key] as Entity<Role>[];
};
