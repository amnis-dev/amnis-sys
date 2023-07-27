import {
  grantTask,
  GrantScope,
  GrantTask,
} from './grant/index.js';
import type {
  Contact,
  Profile,
  Role,
  System,
  User,
  Entity,
  Credential,
  Handle,
  EntityObjects,
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
  historyMake,
} from './entity/index.js';
import { cryptoWeb } from '../io/index.js';
import { accountsGet } from '../accounts.js';
import { stateEntitiesCreate } from '../state.js';

export const dataInitial = async (): Promise<EntityObjects> => {
  /**
   * ================================================================================
   * Roles to be assigned to users
   */
  const roles: Entity<Role>[] = [
    roleSlice.createEntity({
      name: 'Administrator',
      description: 'Most permissive role for overall system configuration and maintenance.',
      color: '#cc0000',
      fsLimits: [-1, -1, -1],
      grants: [
        [systemSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [auditSlice.key, GrantScope.Global, grantTask(0, 1, 1, 1)],
        [historySlice.key, GrantScope.Global, grantTask(0, 1, 1, 1)],
        [userSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [handleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [credentialSlice.key, GrantScope.Global, grantTask(0, 1, 0, 1)],
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [profileSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [contactSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }, { committed: true, new: false }),
    roleSlice.createEntity({
      name: 'Executive',
      description: 'Authoritative role for application configuration and maintenance.',
      color: '#3e3ee6',
      fsLimits: [-1, -1, -1],
      grants: [
        [auditSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [historySlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [userSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [handleSlice.key, GrantScope.Global, grantTask(0, 0, 1, 1)],
        [credentialSlice.key, GrantScope.Global, grantTask(0, 1, 0, 1)],
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [profileSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [contactSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }, { committed: true, new: false }),
    roleSlice.createEntity({
      name: 'Base',
      description: 'Basis for standard authenticated use of the application.',
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
    }, { committed: true, new: false }),
    roleSlice.createEntity({
      name: 'Anonymous',
      description: 'Permissions for accessing the application data without authentication.',
      color: '#000000',
      fsLimits: [0, 0, 0],
      grants: [
        [handleSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [profileSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      ],
    }, { committed: true, new: false }),
  ];

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
      emailVerified: true,
      $roles: [roles[0].$id],
      $permits: [],
    }, { committed: true, new: false }),
    userSlice.createEntity({
      handle: accounts.exec.handle,
      password: await cryptoWeb.passHash(accounts.exec.password),
      email: 'exec@email.addr',
      emailVerified: true,
      $roles: [roles[1].$id],
      $permits: [],
    }, { committed: true, new: false }),
    userSlice.createEntity({
      handle: accounts.user.handle,
      password: await cryptoWeb.passHash(accounts.user.password),
      email: 'user@email.addr',
      emailVerified: true,
      $roles: [roles[2].$id],
      $permits: [],
    }, { committed: true, new: false }),
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
      { $owner: users[0].$id, committed: true, new: false },
    ),
    entityCreate(
      accounts.exec.credential,
      { $owner: users[1].$id, committed: true, new: false },
    ),
    entityCreate(
      accounts.user.credential,
      { $owner: users[2].$id, committed: true, new: false },
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
    }, { $owner: users[0].$id, committed: true, new: false }),
    contactSlice.createEntity({
      name: 'Executive Contact',
      emails: [users[1].email as string],
    }, { $owner: users[1].$id, committed: true, new: false }),
    contactSlice.createEntity({
      name: 'User Contact',
      emails: [users[2].email as string],
    }, { $owner: users[2].$id, committed: true, new: false }),
  ];

  /**
   * ================================================================================
   * User profiles.
   */
  const profiles: Entity<Profile>[] = [
    profileSlice.createEntity({
      $user: users[0].$id,
      $contact: contacts[0].$id,
      nameDisplay: 'Administrator',
    }, { $owner: users[0].$id, committed: true, new: false }),
    profileSlice.createEntity({
      $user: users[1].$id,
      $contact: contacts[1].$id,
      nameDisplay: 'Executive',
    }, { $owner: users[1].$id, committed: true, new: false }),
    profileSlice.createEntity({
      $user: users[2].$id,
      $contact: contacts[2].$id,
      nameDisplay: 'User',
    }, { $owner: users[2].$id, committed: true, new: false }),
  ];

  /**
   * ================================================================================
   * System settings.
   */
  const systems: Entity<System>[] = [
    systemSlice.createEntity({
      name: 'Core System',
      handle: 'core',
      $adminRole: roles[0].$id,
      $execRole: roles[1].$id,
      $anonymousRole: roles[3].$id,
      $initialRoles: [roles[2].$id],
    }, { committed: true, new: false }),
  ];

  const stateEntitiesInital: EntityObjects = {
    [roleSlice.key]: roles,
    [userSlice.key]: users,
    [handleSlice.key]: handles,
    [credentialSlice.key]: credentials,
    [contactSlice.key]: contacts,
    [profileSlice.key]: profiles,
    [systemSlice.key]: systems,
  };

  /**
   * Create this initial history.
   */
  const stateEntities: EntityObjects = {
    ...stateEntitiesInital,
    ...stateEntitiesCreate({
      [historySlice.key]: historyMake(stateEntitiesInital, GrantTask.Create),
    }, { committed: true, new: false }),
  };

  return stateEntities;
};

export default dataInitial;
