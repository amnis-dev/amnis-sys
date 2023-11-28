import {
  auditSlice,
  contactSlice,
  credentialSlice,
  GrantScope,
  grantTask,
  handleSlice,
  profileSlice,
  roleSlice,
  systemSlice,
  userSlice,
} from '../data/index.js';
import { cryptoWeb } from '../io/index.js';
import { camelize, snakeize } from '../string.util.js';
import type { StateDataPromise } from '../types.js';

export interface RecordsProductionOptions {
  /**
   * The email address to use for the administrator account.
   */
  adminEmail?: string;

  /**
   * The handle to use for the administrator account.
   */
  adminHandle?: string;

  /**
   * The password to use for the administrator account.
   */
  adminPassword?: string;

  /**
   * The administrator public key.
   */
  adminPublicKey?: string;

  /**
   * Name of the system.
   */
  systemName?: string;

  /**
   * Email domain for the system.
   */
  systemEmailDomain?: string;

  /**
   * Allowed origins for CORS.
   */
  systemCors?: string[];
}

/**
 * Conventional records for production use that sets up a single administrator account.
 */
export const data: StateDataPromise = async (data) => {
  const options = {
    adminEmail: 'admin@localhost',
    adminHandle: 'admin',
    adminPassword: 'password',
    adminPublicKey: '',
    systemName: 'Core',
    systemEmailDomain: 'localhost',
    systemCors: [],
  };

  const {
    adminEmail,
    adminHandle,
    adminPassword,
    adminPublicKey,
    systemName,
    systemEmailDomain,
    systemCors,
  } = options;

  if (!adminEmail) {
    throw new Error('Missing admin email address');
  }

  /**
   * ================================================================================
   * ROLES
   * ================================================================================
   */
  const roleAdministrator = roleSlice.createEntity({
    name: 'Administrator',
    description: 'Most permissive role for overall system configuration and maintenance.',
    color: '#cc0000',
    fsLimits: [-1, -1, -1],
    grants: [
      [systemSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [auditSlice.key, GrantScope.Global, grantTask(0, 1, 1, 1)],
      [userSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [handleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [credentialSlice.key, GrantScope.Global, grantTask(0, 1, 0, 1)],
      [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [profileSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [contactSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
    ],
  }, { committed: true, new: false });

  const roleExecutive = roleSlice.createEntity({
    name: 'Executive',
    description: 'Authoritative role for application configuration and maintenance.',
    color: '#3e3ee6',
    fsLimits: [-1, -1, -1],
    grants: [
      [auditSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [userSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [handleSlice.key, GrantScope.Global, grantTask(0, 0, 1, 1)],
      [credentialSlice.key, GrantScope.Global, grantTask(0, 1, 0, 1)],
      [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [profileSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [contactSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
    ],
  }, { committed: true, new: false });

  const roleBasic = roleSlice.createEntity({
    name: 'Basic',
    description: 'Basic permissions for standard authenticated use of the application.',
    color: '#000000',
    fsLimits: [32, 64, 1024],
    grants: [
      [userSlice.key, GrantScope.Owned, grantTask(0, 1, 1, 0)],
      [handleSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [credentialSlice.key, GrantScope.Owned, grantTask(0, 1, 0, 1)],
      [profileSlice.key, GrantScope.Owned, grantTask(0, 1, 1, 0)],
      [profileSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [contactSlice.key, GrantScope.Owned, grantTask(0, 1, 1, 0)],
      [contactSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
    ],
  }, { committed: true, new: false });

  const roleAnonymous = roleSlice.createEntity({
    name: 'Anonymous',
    description: 'Basic for standard unauthenticated use of the application.',
    color: '#000000',
    fsLimits: [0, 0, 0],
    grants: [],
  }, { committed: true, new: false });

  const roles = [roleAdministrator, roleExecutive, roleBasic, roleAnonymous];

  /**
   * ================================================================================
   * USERS
   * ================================================================================
   */
  const userAdministrator = userSlice.createEntity({
    handle: adminHandle,
    password: await cryptoWeb.passHash(adminPassword),
    email: adminEmail,
    _emailVerified: true,
    $roles: [roleAdministrator.$id],
    $permits: [],
  }, { committed: true, new: false });

  const users = [userAdministrator];

  /**
   * ================================================================================
   * CONTACTS
   * ================================================================================
   */

  const contactAdministrator = contactSlice.createEntity({
    name: 'Administrator Contact',
    emails: [userAdministrator.email as string],
  }, { $owner: userAdministrator.$id, committed: true, new: false });

  const contacts = [contactAdministrator];

  /**
   * ================================================================================
   * PROFILES
   * ================================================================================
   */
  const profileAdministrator = profileSlice.createEntity({
    $user: userAdministrator.$id,
    $contact: contactAdministrator.$id,
    nameDisplay: 'Administrator',
  }, { $owner: userAdministrator.$id, committed: true, new: false });

  const profiles = [profileAdministrator];

  /**
   * ================================================================================
   * CREDENTIALS
   * ================================================================================
   */
  const credentials = [];

  /**
   * Only create a credential for the administrator if a public key is provided.
   */
  if (adminPublicKey) {
    const credentialAdministrator = credentialSlice.createEntity({
      name: 'System Device',
      publicKey: adminPublicKey,
    }, { $owner: userAdministrator.$id, committed: true, new: false });

    credentials.push(credentialAdministrator);
    userAdministrator.$credentials.push(credentialAdministrator.$id);
  }

  /**
   * ================================================================================
   * HANDLES
   * ================================================================================
   */
  const handleAdministrator = handleSlice.createEntity({
    name: userAdministrator.handle,
    $subject: userAdministrator.$id,
  });

  const handles = [handleAdministrator];

  /**
   * ================================================================================
   * SYSTEM
   * ================================================================================
   */
  const system = systemSlice.createEntity({
    name: systemName,
    handle: snakeize(systemName),
    cors: systemCors,
    otpLength: 8,
    $adminRole: roleAdministrator.$id,
    $execRole: roleExecutive.$id,
    $anonymousRole: roleAnonymous.$id,
    $initialRoles: [roleBasic.$id],
    registrationOpen: false,
    sessionKey: camelize(systemName),
    emailAuth: `auth@${systemEmailDomain}`,
    emailNews: `news@${systemEmailDomain}`,
    emailNotify: `notify@${systemEmailDomain}`,
  }, { committed: true, new: false });

  /**
   * ================================================================================
   * COMPLETE THE RECORDS
   * ================================================================================
   */
  return {
    ...data,
    [userSlice.key]: users,
    [handleSlice.key]: handles,
    [credentialSlice.key]: credentials,
    [contactSlice.key]: contacts,
    [profileSlice.key]: profiles,
  };
};

export default data;
