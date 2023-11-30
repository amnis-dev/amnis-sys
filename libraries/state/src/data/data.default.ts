/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  grantTask,
  GrantScope,
} from './grant/index.js';
import type {
  Contact,
  Profile,
  User,
  Entity,
  Credential,
  Handle,
  EntityObjects,
  System,
} from './entity/index.js';
import {
  entityCreate,
  userSlice,
  handleSlice,
  credentialSlice,
  roleSlice,
  profileSlice,
  contactSlice,
  systemSlice,
  auditSlice,
  historySlice,
} from './entity/index.js';
import { cryptoWeb } from '../io/index.js';
import { accountsGet } from '../accounts.js';
import type { StateDataPromise } from '../types.js';

export const dataTest: StateDataPromise = async (data) => {
  const system: System = data[systemSlice.key][0];
  const roleAdmin = data[roleSlice.key]?.find(
    (role) => role.$id === system?.$adminRole,
  )!;
  const roleExec = data[roleSlice.key]?.find(
    (role) => role.$id === system?.$execRole,
  )!;
  const roleAnonymous = data[roleSlice.key]?.find(
    (role) => role.$id === system?.$anonymousRole,
  )!;

  /**
   * ================================================================================
   * Roles to be assigned to users
   */
  const roleBase = roleSlice.createEntity({
    name: '%role.base.name',
    description: '%role.base.description',
    color: '#000000',
    fsLimits: [32, 64, 1024],
    grants: [
      [historySlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [userSlice.key, GrantScope.Owned, grantTask(0, 1, 1, 0)],
      [handleSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [credentialSlice.key, GrantScope.Owned, grantTask(0, 1, 0, 1)],
      [profileSlice.key, GrantScope.Owned, grantTask(0, 1, 1, 0)],
      [profileSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [contactSlice.key, GrantScope.Owned, grantTask(0, 1, 1, 0)],
      [contactSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
    ],
  });

  data[roleSlice.key].push(roleBase);

  /**
   * ================================================================================
   * User Accounts
   */

  // Setup the accounts.
  const accounts = await accountsGet();

  const users: Entity<User>[] = [
    userSlice.createEntity({
      handle: accounts.admin.handle,
      password: await cryptoWeb.passHash(accounts.admin.password),
      email: 'admin@email.addr',
      _emailVerified: true,
      $roles: [roleAdmin.$id, roleAnonymous.$id],
    }),
    userSlice.createEntity({
      handle: accounts.exec.handle,
      password: await cryptoWeb.passHash(accounts.exec.password),
      email: 'exec@email.addr',
      _emailVerified: true,
      $roles: [roleExec.$id, roleAnonymous.$id],
    }),
    userSlice.createEntity({
      handle: accounts.user.handle,
      password: await cryptoWeb.passHash(accounts.user.password),
      email: 'user@email.addr',
      _emailVerified: true,
      $roles: [roleBase.$id, roleAnonymous.$id],
    }),
  ];

  /**
   * User handles.
   */
  const handles: Entity<Handle>[] = [
    handleSlice.createEntity({
      name: users[0].handle,
      $subject: users[0].$id,
    }),
    handleSlice.createEntity({
      name: users[1].handle,
      $subject: users[1].$id,
    }),
    handleSlice.createEntity({
      name: users[2].handle,
      $subject: users[2].$id,
    }),
  ];

  /**
   * ================================================================================
   * User credentials
   */
  const credentials: Entity<Credential>[] = [
    entityCreate(
      accounts.admin.credential,
      { $owner: users[0].$id },
    ),
    entityCreate(
      accounts.exec.credential,
      { $owner: users[1].$id },
    ),
    entityCreate(
      accounts.user.credential,
      { $owner: users[2].$id },
    ),
  ];

  users[0].$credentials.push(credentials[0].$id);
  users[1].$credentials.push(credentials[1].$id);
  users[2].$credentials.push(credentials[2].$id);

  /**
   * ================================================================================
   * User contacts.
   */
  const contacts: Entity<Contact>[] = [
    contactSlice.createEntity({
      name: 'Administrator Contact',
      emails: [users[0].email as string],
    }, { $owner: users[0].$id }),
    contactSlice.createEntity({
      name: 'Executive Contact',
      emails: [users[1].email as string],
    }, { $owner: users[1].$id }),
    contactSlice.createEntity({
      name: 'User Contact',
      emails: [users[2].email as string],
    }, { $owner: users[2].$id }),
  ];

  /**
   * ================================================================================
   * User profiles.
   */
  const profiles: Entity<Profile>[] = [
    profileSlice.createEntity({
      $_user: users[0].$id,
      $_contact: contacts[0].$id,
      nameDisplay: 'Administrator',
    }, { $owner: users[0].$id }),
    profileSlice.createEntity({
      $_user: users[1].$id,
      $_contact: contacts[1].$id,
      nameDisplay: 'Executive',
    }, { $owner: users[1].$id }),
    profileSlice.createEntity({
      $_user: users[2].$id,
      $_contact: contacts[2].$id,
      nameDisplay: 'User',
    }, { $owner: users[2].$id }),
  ];

  /**
   * ================================================================================
   * Prepare passed in data.
   */
  if (roleAdmin) {
    roleAdmin.grants.push(
      [auditSlice.key, GrantScope.Global, grantTask(0, 1, 1, 1)],
      [historySlice.key, GrantScope.Global, grantTask(0, 1, 1, 1)],
      [userSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [handleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [credentialSlice.key, GrantScope.Global, grantTask(0, 1, 0, 1)],
      [profileSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [contactSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
    );
  }

  if (roleExec) {
    roleExec.grants.push(
      [auditSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [historySlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [userSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [handleSlice.key, GrantScope.Global, grantTask(0, 0, 1, 1)],
      [credentialSlice.key, GrantScope.Global, grantTask(0, 1, 0, 1)],
      [profileSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      [contactSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
    );
  }

  // Add grants to anonymous role.
  if (roleAnonymous) {
    roleAnonymous.grants.push(
      [handleSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      [profileSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
    );
  }

  // Push new base role.
  system.$initialRoles.push(roleAnonymous.$id);
  system.$initialRoles.push(roleBase.$id);

  const stateEntitiesInital: EntityObjects = {
    [userSlice.key]: users,
    [handleSlice.key]: handles,
    [credentialSlice.key]: credentials,
    [contactSlice.key]: contacts,
    [profileSlice.key]: profiles,
  };

  /**
   * Create this initial history.
   */
  return {
    ...data,
    ...stateEntitiesInital,
  };
};

export default dataTest;
