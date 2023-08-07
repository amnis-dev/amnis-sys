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
  Locale,
} from '@amnis/state';
import {
  credentialSlice,
  userSlice,
  profileSlice,
  contactSlice,
  handleSlice,
  roleSlice,
  dataActions,
  localeSlice,
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

/**
 * Finds a locale by name.
 */
export const findLocaleByName = async (
  context: IoContext,
  name: string,
  code: string,
): Promise<Entity<Locale> | undefined> => {
  const { store, database } = context;
  const key = `${code}:${name}`;
  const stateResult = localeSlice.select.byKey(store.getState(), key);
  if (stateResult) {
    return stateResult;
  }

  const results1 = await database.read({
    [localeSlice.key]: {
      $query: {
        key: {
          $eq: key,
        },
      },
    },
  });

  const localeEntity1 = results1[localeSlice.key]?.[0] as Entity<Locale> | undefined;

  if (localeEntity1) {
    localeSlice.action.insert(localeEntity1);
    return localeEntity1;
  }

  const codeActive = localeSlice.select.activeCode(store.getState());

  const key2 = `${codeActive}:${name}`;
  const stateResult2 = localeSlice.select.byKey(store.getState(), key2);
  if (stateResult2) {
    return stateResult;
  }

  const results2 = await database.read({
    [localeSlice.key]: {
      $query: {
        key: {
          $eq: key2,
        },
      },
    },
  });

  const localeEntity2 = results2[localeSlice.key]?.[0] as Entity<Locale> | undefined;

  if (localeEntity2) {
    localeSlice.action.insert(localeEntity2);
    return localeEntity2;
  }

  return undefined;
};

/**
 * Finds a locale by name.
 */
export const findLocaleByNames = async (
  context: IoContext,
  names: string[],
  code: string,
): Promise<Entity<Locale>[]> => {
  const { store, database } = context;
  const keys = names.map((n) => `${code}:${n}`);
  const stateResult = localeSlice.select.byKeys(store.getState(), keys) ?? [];
  if (stateResult.length === keys.length) {
    return stateResult;
  }

  const results1 = await database.read({
    [localeSlice.key]: {
      $query: {
        key: {
          $in: keys,
        },
      },
    },
  });

  const localeEntity1 = results1[localeSlice.key] as Entity<Locale>[] | undefined ?? [];

  if (localeEntity1?.length === keys.length) {
    localeSlice.action.insertMany(localeEntity1);
    return localeEntity1;
  }

  const codeActive = localeSlice.select.activeCode(store.getState());

  const keys2 = names.map((n) => `${codeActive}:${n}`);
  const stateResult2 = localeSlice.select.byKeys(store.getState(), keys2) ?? [];

  if (stateResult2.length === keys.length) {
    return stateResult2;
  }

  const results2 = await database.read({
    [localeSlice.key]: {
      $query: {
        key: {
          $eq: keys2,
        },
      },
    },
  });

  const localeEntity2 = results2[localeSlice.key] as Entity<Locale>[] | undefined ?? [];

  localeSlice.action.insertMany([
    ...stateResult,
    ...localeEntity1,
    ...stateResult2,
    ...localeEntity2,
  ]);

  return localeSlice.select.byKeys(store.getState(), keys);
};
