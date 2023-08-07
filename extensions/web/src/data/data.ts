import {
  type Entity,
  type EntityObjects,
  type StateDataPromise,
  roleSlice,
  GrantScope,
  grantTask,
  systemSlice,
  localeSlice,
} from "@amnis/state";
import { Website, websiteSlice } from "../set/entity/index.js";

export const data: StateDataPromise = async (data) => {
  /**
   * ================================================================================
   * Setup default localized translations.
   */
  const localeWeb = [
    localeSlice.createEntity({
    code: 'en',
    name: 'web:title',
    value: 'My Website',
  }),
  localeSlice.createEntity({
    code: 'en',
    name: 'web:description',
    value: 'This is the description of the website.',
  })
  ];
  // Insert the locale into the data.
  data[localeSlice.key].push(...localeWeb);

  /**
   * ================================================================================
   * Create default website.
   */
  const websites: Entity<Website>[] = [
    websiteSlice.createEntity({
      hostname: 'localhost',
      title: '%web:title',
      description: '%web:description',
      routes: [],
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