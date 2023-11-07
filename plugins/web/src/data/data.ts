import {
  type Entity,
  type EntityObjects,
  type StateDataPromise,
  roleSlice,
  GrantScope,
  grantTask,
  systemSlice,
  routeMapEntities,
  routeSlice,
} from '@amnis/state';
import type { WebComponentID, Website } from '@amnis/web/set';
import { webComponentSlice, webInstanceSlice, websiteSlice } from '@amnis/web/set';

export const data: StateDataPromise = async (data) => {
  /**
   * Routes
   */
  const routes = routeMapEntities({
    '%route.home.label': { path: '/' },
    '%route.about.label': { path: '/about' },
    '%route.about.business.label': { path: '/about/business' },
    '%route.about.team.label': { path: '/about/team' },
    '%route.contact.label': { path: '/contact' },
  });
  data[routeSlice.key].push(...routes);

  /**
   * Web Components
   */
  const componentNavbar = webComponentSlice.createEntity({
    key: 'Navbar',
    type: 'navigation',
    description: '%webComponent.navbar.description',
  });

  /**
   * Web Instances
   */
  const instanceNavbar = webInstanceSlice.createEntity({
    name: '%webInstance.navbar.name',
    $webComponent: componentNavbar.$id as unknown as WebComponentID,
    $route: routes[0].$id,
    routeMatcher: '.*',
  });

  /**
   * Create default website.
   */
  const websites: Entity<Website>[] = [
    websiteSlice.createEntity({
      hostname: 'localhost',
      title: '%website.title',
      description: '%website.description',
      $routes: [
        [routes[0].$id, null],
        [routes[1].$id, null],
        [routes[2].$id, routes[1].$id],
        [routes[3].$id, routes[1].$id],
        [routes[4].$id, null],
      ],
    }),
  ];

  const stateEntitiesInital: EntityObjects = {
    [websiteSlice.key]: websites,
    [webComponentSlice.key]: [
      componentNavbar,
    ],
    [webInstanceSlice.key]: [
      instanceNavbar,
    ],
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
