import type {
  Bearer,
  IoContext,
  JWTAccess,
  Role,
  Session,
  System,
  UID,
  UIDList,
  Credential,
  Entity,
} from '@amnis/state';
import {
  userSlice,
  roleSlice,
  sessionSlice,
  bearerCreate,
  dateNumeric,
  uidList,
  roleComboCreate,
} from '@amnis/state';

/**
 * Generates a session.
 */
export const generateSession = async (
  system: System,
  $subject: UID,
  $credential: UID<Credential>,
  $roles: UIDList<Role> = uidList(),
): Promise<Session> => {
  /**
   * Create the session expiration.
   */
  const sessionExpires = dateNumeric(`${system.sessionExpires}m`);

  const admIs = $roles.includes(system.$adminRole);
  const excIs = $roles.includes(system.$execRole);

  /**
   * Create the new user session.
   */
  const session = sessionSlice.create({
    $subject,
    $credential,
    exp: sessionExpires,
    adm: admIs,
    exc: excIs,
    prv: admIs || excIs,
  });

  return session;
};

/**
 * Create an access bearer token.
 */
export const generateBearer = async (
  context: IoContext,
  system: System,
  subjectId: UID,
  $roles: UIDList<Role>,
): Promise<Bearer> => {
  const { store, crypto } = context;
  /**
   * Create the bearer token expiration.
   */
  const bearerExpires = dateNumeric(`${system.bearerExpires}m`);

  /**
   * Cache a combined grant list from the roles.
   */
  const roles = $roles.map(($role) => (
    roleSlice.select.byId(store.getState(), $role)
  )).filter((role) => !!role) as Entity<Role>[];
  const combo = roleComboCreate(roles);
  store.dispatch(roleSlice.action.insertCombo(combo));

  /**
   * Create the JWT data.
   */
  const jwtAccess: JWTAccess = {
    iss: '',
    sub: subjectId,
    exp: bearerExpires,
    typ: 'access',
    pem: combo[0],
  };

  /**
 * Create the bearer container.
 * This is so we have ensured data about our JWT.
 */
  const bearerAccess = bearerCreate({
    $id: system.handle as UID,
    exp: bearerExpires,
    access: await crypto.accessEncode(jwtAccess),
  });

  return bearerAccess;
};

/**
 * Generate an anonymous user.
 */
export const generateUserAnonymous = (system: System) => {
  const { $anonymousRole } = system;
  return userSlice.createEntity({
    handle: 'anonymous',
    $roles: $anonymousRole ? [$anonymousRole] : [],
  });
};
