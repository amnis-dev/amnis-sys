import {
  systemSlice,
  roleSlice,
  grantTask,
  localeSlice,
  GrantScope,
  localeDocumentToEntities,
  routeSlice,
} from './data/index.js';
import type {
  Role,
  Entity,
  System,
  Route,
} from './data/index.js';
import type { StateDataGuaranteed } from './types.js';
import { en as localeEn } from './data/data.default.en.js';
import { de as localeDe } from './data/data.default.de.js';

export const dataMinimal = (): StateDataGuaranteed => {
  /**
   * Localized translations.
   */
  const localesEn = localeDocumentToEntities('en', localeEn);
  const localesDe = localeDocumentToEntities('de', localeDe);

  /**
   * Routes
   */
  const routes: Entity<Route>[] = [];

  /**
   * Roles to be assigned to users
   */
  const roles: [Entity<Role>, Entity<Role>, Entity<Role>] = [
    roleSlice.createEntity({
      name: '%core:instance:role:admin_name',
      description: '%core:instance:role:admin_desc',
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
      name: '%core:instance:role:exec_name',
      description: '%core:instance:role:exec_desc',
      color: '#3e3ee6',
      fsLimits: [-1, -1, -1],
      grants: [
        [roleSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [localeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [routeSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }),
    roleSlice.createEntity({
      name: '%core:instance:role:anon_name',
      description: '%core:instance:role:anon_desc',
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
    [localeSlice.key]: [
      ...localesEn,
      ...localesDe,
    ],
    [routeSlice.key]: routes,
  };
};

export default dataMinimal;
