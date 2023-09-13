import {
  systemSlice,
  roleSlice,
  grantTask,
  localeSlice,
  GrantScope,
  routeSlice,
} from './data/index.js';
import type {
  Role,
  Entity,
  System,
  Route,
} from './data/index.js';
import type { StateDataGuaranteed } from './types.js';

export const dataMinimal = (): StateDataGuaranteed => {
  /**
   * Routes
   */
  const routes: Entity<Route>[] = [];

  /**
   * Roles to be assigned to users
   */
  const roles: [Entity<Role>, Entity<Role>, Entity<Role>] = [
    roleSlice.createEntity({
      name: '%role.admin.name',
      description: '%role.admin.description',
      color: '#cc0000',
      fsLimits: [-1, -1, -1],
      grants: [
        [systemSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [localeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [routeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }),
    roleSlice.createEntity({
      name: '%role.exec.name',
      description: '%role.exec.description',
      color: '#3e3ee6',
      fsLimits: [-1, -1, -1],
      grants: [
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [localeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [routeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }),
    roleSlice.createEntity({
      name: '%role.anon.name',
      description: '%role.anon.description',
      color: '#000000',
      fsLimits: [0, 0, 0],
      grants: [
        [routeSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)],
      ],
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
    [routeSlice.key]: routes,
  };
};

export default dataMinimal;
