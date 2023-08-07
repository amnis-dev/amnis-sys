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
      code: 'en',
      name: 'core:role_admin_name',
      value: 'Administrator',
    }),
    localeSlice.createEntity({
      code: 'en',
      name: 'core:role_admin_desc',
      value: 'Most permissive role for overall system configuration and maintenance.',
    }),
    localeSlice.createEntity({
      code: 'en',
      name: 'core:role_exec_name',
      value: 'Executive',
    }),
    localeSlice.createEntity({
      code: 'en',
      name: 'core:role_exec_desc',
      value: 'Most permissive role for overall system configuration and maintenance.',
    }),
    localeSlice.createEntity({
      code: 'en',
      name: 'core:role_anon_name',
      value: 'Anonymous',
    }),
    localeSlice.createEntity({
      code: 'en',
      name: 'core:role_anon_desc',
      value: 'Permissions for accessing the application data without authentication.',
    }),
  ];

  /**
   * ================================================================================
   * Roles to be assigned to users
   */
  const roles: [Entity<Role>, Entity<Role>, Entity<Role>] = [
    roleSlice.createEntity({
      name: '%core:role_admin_name',
      description: '%core:role_admin_desc',
      color: '#cc0000',
      fsLimits: [-1, -1, -1],
      grants: [
        [systemSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [localeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }),
    roleSlice.createEntity({
      name: '%core:role_exec_name',
      description: '%core:role_exec_desc',
      color: '#3e3ee6',
      fsLimits: [-1, -1, -1],
      grants: [
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [localeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }),
    roleSlice.createEntity({
      name: '%core:role_anon_name',
      description: '%core:role_anon_desc',
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
      languages: ['en', 'de'],
    }, { committed: true, new: false }),
  ];

  return {
    [systemSlice.key]: systems,
    [roleSlice.key]: roles,
    [localeSlice.key]: locales,
  };
};

export default dataMinimal;
