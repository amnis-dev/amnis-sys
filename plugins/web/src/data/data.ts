import {
  type Entity,
  type EntityObjects,
  type StateDataPromise,
  roleSlice,
  GrantScope,
  grantTask,
  systemSlice,
  localeSlice,
  localeDocumentToEntities,
  routeMapEntities,
  routeSlice,
} from '@amnis/state';
import type { Website } from '../set/entity/index.js';
import { websiteSlice } from '../set/entity/index.js';
import * as dataLocale from './data.locale.js';

export const data: StateDataPromise = async (data) => {
  /**
   * Setup default localized translations.
   */
  Object.keys(dataLocale).forEach((key) => {
    const entities = localeDocumentToEntities(key, dataLocale[key as keyof typeof dataLocale]);
    data[localeSlice.key].push(...entities);
  });

  /**
   * Routes
   */
  const routes = routeMapEntities({
    '%web:route_home': { path: '/' },
    '%web:route_about': { path: '/about' },
    '%web:route_contact': { path: '/contact' },
  });
  data[routeSlice.key].push(...routes);

  /**
   * Create default website.
   */
  const websites: Entity<Website>[] = [
    websiteSlice.createEntity({
      hostname: 'localhost',
      title: '%web:title',
      description: '%web:description',
      $routes: [
        [routes[0].$id, null],
        [routes[1].$id, null],
        [routes[2].$id, null],
      ],
    }),
  ];

  const stateEntitiesInital: EntityObjects = {
    [websiteSlice.key]: websites,
  };

  /**
   * Update core data with needed roles and grants.
   */
  const system = data[systemSlice.key][0];
  const roleAdministrator = data[roleSlice.key].find((role) => role.$id === system.$adminRole);
  const roleAnonymous = data[roleSlice.key].find((role) => role.$id === system.$anonymousRole);

  if (roleAdministrator) {
    roleAdministrator.grants.push([websiteSlice.key, GrantScope.Global, grantTask(1, 1, 1, 1)]);
  }

  if (roleAnonymous) {
    roleAnonymous.grants.push([websiteSlice.key, GrantScope.Global, grantTask(0, 1, 0, 0)]);
  }

  /**
   * Create this initial history.
   */
  return {
    ...data,
    ...stateEntitiesInital,
  };
};

export default data;
