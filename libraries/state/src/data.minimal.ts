import {
  systemSlice,
  roleSlice,
  grantTask,
  localeSlice,
  GrantScope,
} from './data/index.js';
import type {
  Role,
  Entity,
  System,
  Locale,
} from './data/index.js';
import type { StateDataGuaranteed } from './types.js';

export const dataMinimal = (): StateDataGuaranteed => {
  /**
   * ================================================================================
   * Localized translations.
   */
  const locales: Entity<Locale>[] = [
    localeSlice.createEntity({
      code: 'en-us',
      set: 'roles',
      t: {
        admin_name: 'Administrator',
        admin_desc: 'Most permissive role for overall system configuration and maintenance.',
        exec_name: 'Executive',
        exec_desc: 'Authoritative role for application configuration and maintenance.',
        anon_name: 'Anonymous',
        anon_desc: 'Permissions for accessing the application data without authentication.',
      },
    }),
  ];

  /**
   * ================================================================================
   * Roles to be assigned to users
   */
  const roles: [Entity<Role>, Entity<Role>, Entity<Role>] = [
    roleSlice.createEntity({
      name: '%roles:admin_name',
      description: '%roles:admin_desc',
      color: '#cc0000',
      fsLimits: [-1, -1, -1],
      grants: [
        [systemSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }),
    roleSlice.createEntity({
      name: '%roles:exec_name',
      description: '%roles:exec_desc',
      color: '#3e3ee6',
      fsLimits: [-1, -1, -1],
      grants: [
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }),
    roleSlice.createEntity({
      name: '%roles:anon_name',
      description: '%roles:anon_desc',
      color: '#000000',
      fsLimits: [0, 0, 0],
      grants: [],
    }),
  ];

  const systems: [Entity<System>] = [
    systemSlice.createEntity({
      name: 'Core System',
      handle: 'core',
      $adminRole: roles[0].$id,
      $execRole: roles[1].$id,
      $anonymousRole: roles[2].$id,
      $initialRoles: [],
      languages: ['en-us', 'de'],
    }, { committed: true, new: false }),
  ];

  return {
    [systemSlice.key]: systems,
    [roleSlice.key]: roles,
    [localeSlice.key]: locales,
  };
};

export default dataMinimal;
